'use client';
import { memoryGameAction } from '@backend/domain/actions/Games/memory.action';
import { getWords } from '@backend/domain/actions/Word/getWords.action';
import LoaderSpinner from '@core/LoaderSpinner';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { WordWithTranslationsAndUserWords } from 'src/app/api/words/route';

type WordSet = {
    id: string;
    word: string;
    meaning: string;
    relatedWords: {
        word: string;
        id: string;
        isCorrect: boolean;
    }[];
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
    const [currentWordSet, setCurrentWordSet] = useState<WordSet | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [index, setIndex] = useState(0);
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [gameCompleted, setGameCompleted] = useState(false);

    // Fetch words
    const fetchWords = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getWords({
                language: lang,
                ...(mediaId ? { mediaId } : { words: words.slice(index, index + 20).map(x => x.word) }),
                limit: 20
            });

            if (response?.data?.words) {
                setAllWords(prev => [...prev, ...response.data.words]);
            }
        } catch (error) {
            console.error("Error fetching words:", error);
        } finally {
            setIsLoading(false);
        }
    }, [mediaId, words, index, lang]);

    useEffect(() => {
        if (allWords.length < 10) {
            fetchWords();
        }
    }, [allWords, fetchWords]);

    // Create word set for the game when words are loaded
    useEffect(() => {
        if (allWords.length > 0 && !currentWordSet && !gameCompleted) {
            // Get a main word
            const mainWord = allWords[index % allWords.length];

            if (!mainWord) return;

            // Get some related words (we'll use other words from the collection)
            const otherWords = allWords
                .filter(w => w.id !== mainWord.id)
                .slice(0, 5);

            // Create 2 correct matches (words with similar meaning or category)
            // For this demo, we'll just pick 2 random words as "correct" matches
            const correctIndices = [
                Math.floor(Math.random() * otherWords.length),
                (Math.floor(Math.random() * otherWords.length) + 2) % otherWords.length
            ];

            const relatedWords = otherWords.map((word, idx) => ({
                word: word.word,
                id: word.id,
                isCorrect: correctIndices.includes(idx)
            }));

            setCurrentWordSet({
                id: mainWord.id,
                word: mainWord.word,
                meaning: mainWord.translations?.[0]?.meaning || "No meaning available",
                relatedWords
            });

            setSelectedWords([]);
            setFeedback(null);
        }
    }, [allWords, currentWordSet, index, gameCompleted]);

    const handleWordSelection = (wordId: string) => {
        if (feedback !== null) return; // Don't allow selection during feedback

        if (selectedWords.includes(wordId)) {
            // Deselect word
            setSelectedWords(prev => prev.filter(id => id !== wordId));
        } else {
            // Select word, but limit to 2 selections
            if (selectedWords.length < 2) {
                setSelectedWords(prev => [...prev, wordId]);
            }
        }
    };

    const checkAnswers = async () => {
        if (!currentWordSet || selectedWords.length !== 2) return;

        // Find the selected words in the related words array
        const selectedRelatedWords = currentWordSet.relatedWords.filter(word =>
            selectedWords.includes(word.id)
        );

        // Check if all selected words are correct
        const allCorrect = selectedRelatedWords.every(word => word.isCorrect);
        const allSelected = selectedRelatedWords.length === 2;

        // Store the result
        setFeedback(allCorrect && allSelected ? 'correct' : 'incorrect');

        // Update score
        if (allCorrect && allSelected) {
            setScore(prev => prev + (10 * level));

            // Record success with API
            try {
                await memoryGameAction({
                    wordId: currentWordSet.id,
                    hard: false,
                    mediaId
                });

                // Increase level every 3 correct answers
                if ((index + 1) % 3 === 0) {
                    setLevel(prev => Math.min(prev + 1, 5));
                }
            } catch (error) {
                console.error("Error recording success:", error);
            }
        } else {
            // Record failure with API
            try {
                await memoryGameAction({
                    wordId: currentWordSet.id,
                    hard: true,
                    mediaId
                });
            } catch (error) {
                console.error("Error recording failure:", error);
            }
        }

        // Show feedback for a moment
        setTimeout(() => {
            setFeedback(null);
            setCurrentWordSet(null);
            setIndex(prev => prev + 1);

            // End game after certain number of rounds
            if (index >= 9) {
                setGameCompleted(true);
            }
        }, 2000);
    };

    // Show loader while fetching initial words
    if (isLoading && allWords.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <LoaderSpinner size="large" />
                    <p className="mt-4 text-zinc-300 dark:text-zinc-400">Loading word associations...</p>
                </div>
            </div>
        );
    }

    // Show game completed screen
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
                        You've completed all word association challenges!
                    </p>

                    <div className="flex justify-center">
                        <motion.button
                            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-medium rounded-lg shadow-lg"
                            onClick={() => {
                                setGameCompleted(false);
                                setScore(0);
                                setLevel(1);
                                setIndex(0);
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

    // Show loading state between rounds
    if (!currentWordSet) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <LoaderSpinner size="large" />
                    <p className="mt-4 text-zinc-300 dark:text-zinc-400">Preparing next challenge...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-full w-full flex items-center justify-center p-6">
            {/* Background decorations */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-40 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '12s' }} />

            {/* Game container */}
            <motion.div
                className="w-full max-w-2xl bg-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Game header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                        <div className="bg-gray-800/70 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="text-emerald-400 font-medium">Level {level}</span>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="bg-gray-800/70 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="text-white font-medium">Score: <span className="text-emerald-400">{score}</span></span>
                        </div>
                    </div>
                </div>

                {/* Game instruction */}
                <div className="mb-6 text-center">
                    <h3 className="text-white text-lg font-medium mb-1">Select the 2 words most closely related to:</h3>
                    <div className="mt-2 flex items-center justify-center">
                        <motion.div
                            className="bg-emerald-500/90 px-6 py-3 rounded-lg shadow-lg"
                            whileHover={{ scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        >
                            <h2 className="text-white text-2xl font-bold">{currentWordSet.word}</h2>
                        </motion.div>
                    </div>

                    <div className="mt-4 text-zinc-300">
                        <p className="italic">"{currentWordSet.meaning}"</p>
                    </div>
                </div>

                {/* Word choices */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    {currentWordSet.relatedWords.map((word, idx) => (
                        <motion.button
                            key={word.id}
                            className={clsx(
                                "py-4 px-3 rounded-lg backdrop-blur-sm shadow-md text-white font-medium border-2 transition-all",
                                selectedWords.includes(word.id)
                                    ? "bg-indigo-600/80 border-indigo-400"
                                    : "bg-gray-800/40 border-gray-700/50 hover:bg-gray-700/60"
                            )}
                            onClick={() => handleWordSelection(word.id)}
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.97 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                transition: { delay: idx * 0.1 }
                            }}
                        >
                            {word.word}
                        </motion.button>
                    ))}
                </div>

                {/* Submit button */}
                <div className="flex justify-center">
                    <motion.button
                        className={clsx(
                            "px-8 py-3 rounded-lg font-medium shadow-lg transition-all",
                            selectedWords.length === 2
                                ? "bg-emerald-500 text-white hover:bg-emerald-400"
                                : "bg-gray-700/50 text-gray-400 cursor-not-allowed"
                        )}
                        onClick={checkAnswers}
                        disabled={selectedWords.length !== 2}
                        whileHover={{ scale: selectedWords.length === 2 ? 1.05 : 1 }}
                        whileTap={{ scale: selectedWords.length === 2 ? 0.95 : 1 }}
                    >
                        Submit
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
                                    {feedback === 'correct' ? "Correct!" : "Try Again!"}
                                </span>
                                <p className="text-white/80">
                                    {feedback === 'correct'
                                        ? `+${10 * level} points!`
                                        : "Those words aren't the most related."
                                    }
                                </p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};
