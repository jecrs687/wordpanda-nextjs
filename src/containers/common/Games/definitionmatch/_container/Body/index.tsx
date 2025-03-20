'use client';
import { memoryGameAction } from '@backend/domain/actions/Games/memory.action';
import { getWords } from '@backend/domain/actions/Word/getWords.action';
import LoaderSpinner from '@core/LoaderSpinner';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { WordWithTranslationsAndUserWords } from 'src/app/api/words/route';

type MatchItem = {
    id: string;
    word: string;
    definition: string;
};

type MatchPair = {
    wordId: string;
    definitionId: string;
};

export const Body = ({
    words,
    lang,
    mediaId
}: {
    words: { word: string }[],
    lang: string,
    mediaId?: string
}) => {
    const [allWords, setAllWords] = useState<WordWithTranslationsAndUserWords[]>([]);
    const [gameWords, setGameWords] = useState<MatchItem[]>([]);
    const [availableWords, setAvailableWords] = useState<MatchItem[]>([]);
    const [availableDefinitions, setAvailableDefinitions] = useState<MatchItem[]>([]);
    const [matches, setMatches] = useState<MatchPair[]>([]);
    const [selectedWord, setSelectedWord] = useState<string | null>(null);
    const [selectedDefinition, setSelectedDefinition] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerRound, setItemsPerRound] = useState(4);

    // Fetch words
    const fetchWords = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getWords({
                language: lang,
                ...(mediaId ? { mediaId } : { words: words.slice(currentIndex, currentIndex + 20).map(x => x.word) }),
                limit: 20
            });

            if (response?.data?.words) {
                const newWords = response.data.words.filter(word =>
                    word.translations &&
                    word.translations.length > 0 &&
                    word.translations[0].meaning
                );

                setAllWords(prev => [...prev, ...newWords]);
                setCurrentIndex(prev => prev + 20);
            }
        } catch (error) {
            console.error("Error fetching words:", error);
        } finally {
            setIsLoading(false);
        }
    }, [mediaId, words, currentIndex, lang]);

    // Prepare game round
    const prepareRound = useCallback(() => {
        if (allWords.length < itemsPerRound) {
            fetchWords();
            return;
        }

        setIsLoading(true);

        // Get next batch of words for this round
        const wordsForThisRound = allWords
            .slice(0, itemsPerRound)
            .map(word => ({
                id: word.id,
                word: word.word,
                definition: word.translations?.[0]?.meaning || 'No definition available'
            }));

        // Update allWords to remove used words
        setAllWords(prev => prev.slice(itemsPerRound));

        // Set up game state
        setGameWords(wordsForThisRound);
        setAvailableWords([...wordsForThisRound]);
        setAvailableDefinitions([...wordsForThisRound].sort(() => Math.random() - 0.5));
        setMatches([]);
        setSelectedWord(null);
        setSelectedDefinition(null);
        setFeedback(null);

        setIsLoading(false);
    }, [allWords, fetchWords, itemsPerRound]);

    // Initialize game
    useEffect(() => {
        if (allWords.length === 0) {
            fetchWords();
        }
    }, [allWords.length, fetchWords]);

    // Set up new round when allWords changes
    useEffect(() => {
        if (!isLoading && allWords.length > 0 && availableWords.length === 0) {
            prepareRound();
        }
    }, [isLoading, allWords, availableWords.length, prepareRound]);

    // Handle word selection
    const handleWordClick = (id: string) => {
        if (feedback !== null) return;

        setSelectedWord(id === selectedWord ? null : id);

        // If definition is already selected, check match
        if (selectedDefinition && id !== selectedWord) {
            checkMatch(id, selectedDefinition);
        }
    };

    // Handle definition selection
    const handleDefinitionClick = (id: string) => {
        if (feedback !== null) return;

        setSelectedDefinition(id === selectedDefinition ? null : id);

        // If word is already selected, check match
        if (selectedWord && id !== selectedDefinition) {
            checkMatch(selectedWord, id);
        }
    };

    // Check if the selected word and definition match
    const checkMatch = async (wordId: string, definitionId: string) => {
        const isMatch = wordId === definitionId;

        if (isMatch) {
            // Add to matches
            setMatches(prev => [...prev, { wordId, definitionId }]);

            // Clear selections
            setSelectedWord(null);
            setSelectedDefinition(null);

            // Update score
            setScore(prev => prev + (10 * round));

            // Record success with API
            try {
                await memoryGameAction({
                    wordId,
                    hard: false,
                    mediaId
                });
            } catch (error) {
                console.error("Error recording success:", error);
            }

            // Check if round is complete
            if (matches.length + 1 >= itemsPerRound) {
                setFeedback('correct');

                setTimeout(() => {
                    if (round >= 5) {
                        setGameCompleted(true);
                    } else {
                        setRound(prev => prev + 1);
                        setItemsPerRound(prev => Math.min(prev + 1, 8)); // Increase difficulty each round
                        prepareRound();
                    }
                }, 1500);
            }
        } else {
            // Show incorrect feedback
            setFeedback('incorrect');

            // Record failure with API
            try {
                await memoryGameAction({
                    wordId,
                    hard: true,
                    mediaId
                });
            } catch (error) {
                console.error("Error recording failure:", error);
            }

            // Clear after a short delay
            setTimeout(() => {
                setFeedback(null);
                setSelectedWord(null);
                setSelectedDefinition(null);
            }, 1000);
        }
    };

    // Filter available items
    const filteredWords = availableWords.filter(
        word => !matches.some(match => match.wordId === word.id)
    );

    const filteredDefinitions = availableDefinitions.filter(
        def => !matches.some(match => match.definitionId === def.id)
    );

    // Loading state
    if (isLoading && (allWords.length === 0 || availableWords.length === 0)) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <LoaderSpinner size="large" />
                    <p className="mt-4 text-zinc-300 dark:text-zinc-400">
                        Loading definition matching game...
                    </p>
                </div>
            </div>
        );
    }

    // Game completed screen
    if (gameCompleted) {
        return (
            <div className="h-full w-full flex items-center justify-center p-6">
                <motion.div
                    className="max-w-lg w-full bg-gray-900/70 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-8 shadow-xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl font-bold text-white text-center mb-6">Game Completed!</h2>
                    <div className="flex justify-center mb-8">
                        <div className="bg-emerald-500/20 backdrop-blur-sm rounded-full px-8 py-4">
                            <span className="text-emerald-400 text-2xl font-bold">Final Score: {score}</span>
                        </div>
                    </div>

                    <p className="text-zinc-300 text-center mb-8">
                        You've mastered all definition matching challenges!
                    </p>

                    <div className="flex justify-center">
                        <motion.button
                            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-medium rounded-lg shadow-lg"
                            onClick={() => {
                                setGameCompleted(false);
                                setScore(0);
                                setRound(1);
                                setItemsPerRound(4);
                                prepareRound();
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Play Again
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="relative h-full w-full flex flex-col items-center justify-center p-6">
            {/* Background decorations */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-40 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '12s' }} />

            {/* Game header */}
            <div className="w-full max-w-4xl mb-6">
                <div className="flex justify-between items-center">
                    <motion.div
                        className="bg-gray-800/70 backdrop-blur-sm rounded-full px-4 py-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="text-emerald-400 font-medium">Round {round}/5</span>
                    </motion.div>

                    <motion.div
                        className="bg-gray-800/70 backdrop-blur-sm rounded-full px-4 py-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="text-white font-medium">Score: <span className="text-emerald-400">{score}</span></span>
                    </motion.div>
                </div>

                <motion.div
                    className="mt-4 text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="text-white text-xl font-medium">Match each word with its correct definition</h2>
                    <p className="text-zinc-400 text-sm mt-1">Complete {itemsPerRound} matches to advance to the next round</p>
                </motion.div>
            </div>

            {/* Game grid */}
            <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
                {/* Words column */}
                <motion.div
                    className="flex flex-col gap-3"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <h3 className="text-zinc-300 text-sm uppercase tracking-wider mb-1 text-center">Words</h3>

                    <div className="space-y-3">
                        {filteredWords.map((word, idx) => (
                            <motion.button
                                key={word.id}
                                className={clsx(
                                    "w-full py-3 px-4 rounded-lg font-medium transition-all",
                                    selectedWord === word.id
                                        ? "bg-indigo-600/80 text-white shadow-lg border-2 border-indigo-400"
                                        : "bg-gray-800/60 text-white border-2 border-gray-700/50 hover:bg-gray-700/80"
                                )}
                                onClick={() => handleWordClick(word.id)}
                                whileHover={{ x: 5 }}
                                whileTap={{ scale: 0.97 }}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                    transition: { delay: idx * 0.1 }
                                }}
                            >
                                {word.word}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Definitions column */}
                <motion.div
                    className="flex flex-col gap-3"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <h3 className="text-zinc-300 text-sm uppercase tracking-wider mb-1 text-center">Definitions</h3>

                    <div className="space-y-3">
                        {filteredDefinitions.map((def, idx) => (
                            <motion.button
                                key={def.id}
                                className={clsx(
                                    "w-full py-3 px-4 rounded-lg font-medium transition-all text-left",
                                    selectedDefinition === def.id
                                        ? "bg-emerald-600/80 text-white shadow-lg border-2 border-emerald-400"
                                        : "bg-gray-800/60 text-white border-2 border-gray-700/50 hover:bg-gray-700/80"
                                )}
                                onClick={() => handleDefinitionClick(def.id)}
                                whileHover={{ x: -5 }}
                                whileTap={{ scale: 0.97 }}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                    transition: { delay: idx * 0.1 }
                                }}
                            >
                                {def.definition}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Feedback overlay */}
            <AnimatePresence>
                {feedback && (
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            backgroundColor: feedback === 'correct'
                                ? 'rgba(16, 185, 129, 0.2)'
                                : 'rgba(239, 68, 68, 0.2)'
                        }}
                    >
                        <motion.div
                            className={clsx(
                                "px-8 py-6 rounded-2xl backdrop-blur-md flex flex-col items-center shadow-lg",
                                feedback === 'correct'
                                    ? "bg-emerald-500/70"
                                    : "bg-rose-500/70"
                            )}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", bounce: 0.4 }}
                        >
                            <span className="text-white text-3xl font-bold mb-2">
                                {feedback === 'correct' && matches.length >= itemsPerRound
                                    ? `Round ${round} Complete!`
                                    : feedback === 'correct'
                                        ? "Match!"
                                        : "Not a match!"
                                }
                            </span>
                            <p className="text-white/80">
                                {feedback === 'correct' && matches.length >= itemsPerRound
                                    ? round < 5
                                        ? "Get ready for the next round!"
                                        : "Congratulations on completing all rounds!"
                                    : feedback === 'correct'
                                        ? `+${10 * round} points!`
                                        : "Try matching another pair."
                                }
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
