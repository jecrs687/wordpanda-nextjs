'use client';
import { memoryGameAction } from '@backend/domain/actions/Games/memory.action';
import { getWords } from '@backend/domain/actions/Word/getWords.action';
import LoaderSpinner from '@core/LoaderSpinner';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { WordWithTranslationsAndUserWords } from 'src/app/api/words/route';

type SentenceWord = {
    id: string;
    word: string;
    position: number | null;
    isSelected: boolean;
};

type Sentence = {
    words: SentenceWord[];
    solution: string[];
    meaning: string;
    difficulty: number;
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
    const [currentSentence, setCurrentSentence] = useState<Sentence | null>(null);
    const [userSolution, setUserSolution] = useState<SentenceWord[]>([]);
    const [availableWords, setAvailableWords] = useState<SentenceWord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [streakCount, setStreakCount] = useState(0);

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
                const filteredWords = response.data.words.filter(word =>
                    word.translations &&
                    word.translations.length > 0 &&
                    word.translations[0].meaning
                );

                setAllWords(prev => [...prev, ...filteredWords]);
                setCurrentIndex(prev => prev + 20);
            }
        } catch (error) {
            console.error("Error fetching words:", error);
        } finally {
            setIsLoading(false);
        }
    }, [mediaId, words, currentIndex, lang]);

    // Create a sentence from words
    const createSentence = useCallback(() => {
        if (allWords.length < 5) {
            fetchWords();
            return;
        }

        // Select words for the sentence (3-6 words based on level)
        const wordCount = Math.min(3 + level, 7);
        const selectedWords = allWords.slice(0, wordCount);

        // Create sentence structure
        const sentenceWords: SentenceWord[] = selectedWords.map((word, index) => ({
            id: word.id,
            word: word.word.toLowerCase(),
            position: index,
            isSelected: false
        }));

        // Create solution array
        const solution = sentenceWords.map(word => word.word);

        // Get meaning from first word as context
        const meaning = selectedWords[0].translations?.[0]?.meaning || 'Create a sentence with these words';

        // Create sentence object
        const newSentence: Sentence = {
            words: sentenceWords,
            solution,
            meaning,
            difficulty: level
        };

        // Shuffle words for user to arrange
        const shuffled = [...sentenceWords].map(word => ({
            ...word,
            position: null
        })).sort(() => Math.random() - 0.5);

        setCurrentSentence(newSentence);
        setAvailableWords(shuffled);
        setUserSolution([]);

        // Remove used words from pool
        setAllWords(prev => prev.slice(wordCount));
    }, [allWords, level, fetchWords]);

    // Initialize
    useEffect(() => {
        if (allWords.length === 0) {
            fetchWords();
        } else if (!currentSentence) {
            createSentence();
        }
    }, [allWords, fetchWords, currentSentence, createSentence]);

    // Handle word selection
    const handleWordSelect = (word: SentenceWord) => {
        if (feedback !== null) return;

        // Add word to solution
        setUserSolution(prev => [...prev, { ...word, position: prev.length }]);

        // Remove from available words
        setAvailableWords(prev => prev.filter(w => w.id !== word.id));
    };

    // Handle removing word from solution
    const handleRemoveWord = (index: number) => {
        if (feedback !== null) return;

        // Get the word to remove
        const wordToRemove = userSolution[index];

        // Remove from solution
        setUserSolution(prev => prev.filter((_, idx) => idx !== index));

        // Add back to available words
        setAvailableWords(prev => [...prev, { ...wordToRemove, position: null }]);
    };

    // Check solution
    const checkSolution = async () => {
        if (!currentSentence || userSolution.length === 0) return;

        // Compare user solution with correct solution
        // For simplicity, we'll just check if all words are included, not precise order
        const isCorrect = userSolution.length === currentSentence.solution.length;

        setFeedback(isCorrect ? 'correct' : 'incorrect');

        if (isCorrect) {
            // Calculate points based on difficulty and streak
            const points = 10 * level + (streakCount * 5);
            setScore(prev => prev + points);
            setStreakCount(prev => prev + 1);

            // Record success with API
            try {
                // Record success for all words in the sentence
                for (const word of currentSentence.words) {
                    await memoryGameAction({
                        wordId: word.id,
                        hard: false,
                        mediaId
                    });
                }
            } catch (error) {
                console.error("Error recording success:", error);
            }
        } else {
            // Reset streak on incorrect
            setStreakCount(0);

            // Record failure with API
            try {
                // We'll record failure just for the first word
                await memoryGameAction({
                    wordId: currentSentence.words[0].id,
                    hard: true,
                    mediaId
                });
            } catch (error) {
                console.error("Error recording failure:", error);
            }
        }

        // Move to next sentence after delay
        setTimeout(() => {
            setFeedback(null);

            // Increase level every 3 correct answers
            if (isCorrect && (score + 10) % 30 === 0) {
                setLevel(prev => Math.min(prev + 1, 5));
            }

            // Check if game should end
            if (level >= 5 && streakCount >= 5) {
                setGameCompleted(true);
            } else {
                // Move to next sentence
                setCurrentSentence(null);
            }
        }, 2000);
    };

    // Reset current sentence
    const resetSentence = () => {
        if (!currentSentence) return;

        // Reset to initial state
        const shuffled = [...currentSentence.words].map(word => ({
            ...word,
            position: null
        })).sort(() => Math.random() - 0.5);

        setAvailableWords(shuffled);
        setUserSolution([]);
    };

    // Start a new game
    const startNewGame = () => {
        setScore(0);
        setLevel(1);
        setStreakCount(0);
        setGameCompleted(false);
        setCurrentSentence(null);

        if (allWords.length < 10) {
            fetchWords();
        }
    };

    // Loading state
    if (isLoading && allWords.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <LoaderSpinner size="large" color="emerald" />
                    <p className="mt-4 text-zinc-300 dark:text-zinc-400">
                        Loading sentence builder...
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
                        You've mastered sentence building!
                    </p>

                    <div className="flex justify-center">
                        <motion.button
                            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-medium rounded-lg shadow-lg"
                            onClick={startNewGame}
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

    if (!currentSentence) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <LoaderSpinner size="large" color="emerald" />
                    <p className="mt-4 text-zinc-300 dark:text-zinc-400">
                        Preparing next sentence...
                    </p>
                </div>
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
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="bg-gray-800/70 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="text-emerald-400 font-medium">Level {level}</span>
                        </div>

                        <div className="bg-gray-800/70 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="text-white font-medium">Score: <span className="text-emerald-400">{score}</span></span>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-gray-800/70 backdrop-blur-sm rounded-full px-4 py-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="text-white font-medium">Streak: <span className={clsx(
                            streakCount > 2 ? "text-amber-400" : "text-zinc-400"
                        )}>{streakCount}</span></span>
                    </motion.div>
                </div>

                <motion.div
                    className="mt-4 text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="text-white text-xl font-medium">Build a meaningful sentence</h2>
                    <p className="text-zinc-400 text-sm mt-1">Arrange the words to form a correct sentence</p>
                </motion.div>
            </div>

            {/* Sentence context */}
            <motion.div
                className="w-full max-w-4xl mb-8 bg-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <h3 className="text-zinc-300 text-sm uppercase tracking-wider mb-2 text-center">Context</h3>
                <p className="text-white text-center">{currentSentence.meaning}</p>
            </motion.div>

            {/* User sentence construction area */}
            <motion.div
                className="w-full max-w-4xl mb-8 min-h-[100px] bg-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <div className="flex flex-wrap justify-center gap-3">
                    {userSolution.length === 0 ? (
                        <p className="text-zinc-500 italic">Select words to build your sentence</p>
                    ) : (
                        userSolution.map((word, idx) => (
                            <motion.button
                                key={`solution-${word.id}`}
                                className="px-4 py-2 bg-indigo-600/80 rounded-lg shadow-md text-white font-medium"
                                onClick={() => handleRemoveWord(idx)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    transition: { delay: idx * 0.05 }
                                }}
                            >
                                {word.word}
                            </motion.button>
                        ))
                    )}
                </div>
            </motion.div>

            {/* Available words */}
            <motion.div
                className="w-full max-w-4xl mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <div className="flex flex-wrap justify-center gap-3">
                    {availableWords.map((word, idx) => (
                        <motion.button
                            key={`available-${word.id}`}
                            className="px-4 py-2 bg-gray-800/60 hover:bg-gray-700/60 rounded-lg shadow-md text-white font-medium"
                            onClick={() => handleWordSelect(word)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                transition: { delay: 0.5 + idx * 0.05 }
                            }}
                        >
                            {word.word}
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Controls */}
            <div className="w-full max-w-4xl flex justify-center gap-4">
                <motion.button
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg shadow-md text-white font-medium"
                    onClick={resetSentence}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    Reset
                </motion.button>

                <motion.button
                    className={clsx(
                        "px-6 py-3 rounded-lg shadow-md font-medium",
                        userSolution.length > 0
                            ? "bg-emerald-500 hover:bg-emerald-400 text-white"
                            : "bg-gray-700/50 text-gray-400 cursor-not-allowed"
                    )}
                    onClick={checkSolution}
                    disabled={userSolution.length === 0}
                    whileHover={{ scale: userSolution.length > 0 ? 1.05 : 1 }}
                    whileTap={{ scale: userSolution.length > 0 ? 0.95 : 1 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    Check Sentence
                </motion.button>
            </div>

            {/* Feedback overlay */}
            <AnimatePresence>
                {feedback && (
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ backgroundColor: feedback === 'correct' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)' }}
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
                                {feedback === 'correct' ? "Great job!" : "Try again!"}
                            </span>
                            <p className="text-white/80">
                                {feedback === 'correct'
                                    ? `+${10 * level + (streakCount * 5)} points!`
                                    : "That's not quite right."
                                }
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
