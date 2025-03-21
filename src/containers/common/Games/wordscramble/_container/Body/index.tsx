'use client';
import { memoryGameAction } from '@backend/domain/actions/Games/memory.action';
import { getWords } from '@backend/domain/actions/Word/getWords.action';
import LoaderSpinner from '@core/LoaderSpinner';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { WordWithTranslationsAndUserWords } from 'src/app/api/words/route';

type ScrambledWord = {
    original: string;
    scrambled: string;
    meaning: string;
    id: string;
    completed: boolean;
};

export const Body = ({ words, lang, mediaId }: {
    words: { word: string }[],
    lang: string,
    mediaId?: string
}) => {
    const [allWords, setAllWords] = useState<WordWithTranslationsAndUserWords[]>([]);
    const [currentWord, setCurrentWord] = useState<ScrambledWord | null>(null);
    const [userSolution, setUserSolution] = useState<string[]>([]);
    const [availableLetters, setAvailableLetters] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [completedWords, setCompletedWords] = useState<string[]>([]);

    // Fetch words
    const fetchWords = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getWords({
                language: lang,
                ...(mediaId ? { mediaId } : { words: words.slice(currentIndex, currentIndex + 10).map(x => x.word) }),
                limit: 10
            });

            if (response?.data?.words) {
                setAllWords(prev => [...prev, ...response.data.words]);
                setCurrentIndex(prev => prev + 10);
            }
        } catch (error) {
            console.error("Error fetching words:", error);
        } finally {
            setIsLoading(false);
        }
    }, [mediaId, words, currentIndex, lang]);

    useEffect(() => {
        if (currentIndex >= allWords.length) {
            fetchWords();
        }
    }, [currentIndex, allWords, fetchWords]);

    // Set up current word
    useEffect(() => {
        if (allWords.length > currentIndex && !currentWord) {
            const word = allWords[currentIndex];
            if (word && word.word && !completedWords.includes(word.id)) {
                const letters = word.word.toLowerCase().split('');
                // Scramble the letters
                const scrambled = [...letters].sort(() => Math.random() - 0.5);

                setCurrentWord({
                    original: word.word.toLowerCase(),
                    scrambled: scrambled.join(''),
                    meaning: word.translations?.[0]?.meaning || '',
                    id: word.id,
                    completed: false
                });

                setAvailableLetters(scrambled);
                setUserSolution([]);
            } else {
                setCurrentIndex(currentIndex + 1);
            }
        }
    }, [allWords, currentIndex, currentWord, completedWords]);

    // Handle letter clicks
    const handleLetterClick = (letter: string, index: number) => {
        // Add letter to solution
        setUserSolution(prev => [...prev, letter]);

        // Remove letter from available letters
        setAvailableLetters(prev => {
            const newAvailable = [...prev];
            newAvailable.splice(index, 1);
            return newAvailable;
        });
    };

    const handleSolutionLetterClick = (letter: string, index: number) => {
        // Remove letter from solution
        setUserSolution(prev => {
            const newSolution = [...prev];
            newSolution.splice(index, 1);
            return newSolution;
        });

        // Add letter back to available letters
        setAvailableLetters(prev => [...prev, letter]);
    };

    const checkSolution = async () => {
        if (!currentWord) return;

        const solution = userSolution.join('');
        const isWordCorrect = solution === currentWord.original;

        setIsCorrect(isWordCorrect);

        if (isWordCorrect) {
            // Update score and streak
            setScore(prev => prev + 10 + streak);
            setStreak(prev => prev + 1);

            // Mark word as completed
            setCompletedWords(prev => [...prev, currentWord.id]);

            // Record success with API
            try {
                await memoryGameAction({
                    wordId: currentWord.id,
                    hard: false,
                    mediaId
                });
            } catch (error) {
                console.error("Error recording success:", error);
            }
        } else {
            // Reset streak
            setStreak(0);

            // Record failure with API
            try {
                await memoryGameAction({
                    wordId: currentWord.id,
                    hard: true,
                    mediaId
                });
            } catch (error) {
                console.error("Error recording failure:", error);
            }
        }

        // Show result for a moment before moving to next word
        setTimeout(() => {
            setCurrentWord(null);
            setCurrentIndex(prev => prev + 1);
            setIsCorrect(null);
        }, 2000);
    };

    const resetCurrentWord = () => {
        if (!currentWord) return;

        // Reset to scrambled state
        const scrambledLetters = currentWord.scrambled.split('');
        setAvailableLetters(scrambledLetters);
        setUserSolution([]);
    };

    if (isLoading && !currentWord) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <LoaderSpinner size="large" />
                    <p className="mt-4 text-zinc-300 dark:text-zinc-400">
                        Loading word scramble game...
                    </p>
                </div>
            </div>
        );
    }

    if (!currentWord) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <LoaderSpinner size="large" />
                    <p className="mt-4 text-zinc-300 dark:text-zinc-400">
                        Preparing next word...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-full w-full flex flex-col items-center justify-center p-4">
            {/* Background decorations */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '8s' }} />

            {/* Score display */}
            <div className="w-full flex justify-between items-center mb-6">
                <motion.div
                    className="flex items-center bg-gray-800/50 backdrop-blur-md px-4 py-2 rounded-full"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="text-white font-medium">Score: <span className="text-emerald-400">{score}</span></span>
                </motion.div>

                <motion.div
                    className="flex items-center bg-gray-800/50 backdrop-blur-md px-4 py-2 rounded-full"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <span className="text-white font-medium">Streak: <span className="text-amber-400">{streak}</span></span>
                </motion.div>
            </div>

            {/* Main game container */}
            <motion.div
                className="w-full max-w-md"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Word meaning */}
                <div className="bg-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-xl p-6 mb-6 shadow-lg">
                    <h3 className="text-zinc-300 text-sm uppercase tracking-wider mb-2">Definition</h3>
                    <p className="text-white text-lg">{currentWord.meaning}</p>
                </div>

                {/* User solution */}
                <div className="bg-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-xl p-4 mb-6 shadow-lg">
                    <div className="flex flex-wrap justify-center gap-2 min-h-12">
                        {userSolution.length > 0 ? (
                            userSolution.map((letter, idx) => (
                                <motion.button
                                    key={`solution-${idx}`}
                                    className="w-10 h-10 bg-indigo-600/80 text-white text-xl font-bold rounded-lg shadow-md"
                                    onClick={() => handleSolutionLetterClick(letter, idx)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                >
                                    {letter.toUpperCase()}
                                </motion.button>
                            ))
                        ) : (
                            <p className="text-zinc-400 py-2">Tap letters to form the word</p>
                        )}
                    </div>
                </div>

                {/* Available letters */}
                <div className="bg-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-xl p-6 shadow-lg mb-6">
                    <h3 className="text-zinc-300 text-sm uppercase tracking-wider mb-4 text-center">Available Letters</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {availableLetters.map((letter, idx) => (
                            <motion.button
                                key={`letter-${idx}`}
                                className="w-12 h-12 bg-gray-800/80 text-white text-xl font-bold rounded-lg shadow-md hover:bg-gray-700/90"
                                onClick={() => handleLetterClick(letter, idx)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                {letter.toUpperCase()}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-between gap-4">
                    <motion.button
                        className="flex-1 py-3 bg-gray-800/80 hover:bg-gray-700/90 text-zinc-300 font-medium rounded-lg shadow-md"
                        onClick={resetCurrentWord}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        Reset
                    </motion.button>

                    <motion.button
                        className={clsx(
                            "flex-1 py-3 rounded-lg font-medium shadow-md transition-all",
                            userSolution.length > 0
                                ? "bg-emerald-500 hover:bg-emerald-400 text-white"
                                : "bg-gray-800/50 text-gray-500 cursor-not-allowed"
                        )}
                        onClick={checkSolution}
                        disabled={userSolution.length === 0}
                        whileHover={{ scale: userSolution.length > 0 ? 1.03 : 1 }}
                        whileTap={{ scale: userSolution.length > 0 ? 0.97 : 1 }}
                    >
                        Check
                    </motion.button>
                </div>

                {/* Feedback overlay */}
                <AnimatePresence>
                    {isCorrect !== null && (
                        <motion.div
                            className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ backgroundColor: isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)' }}
                        >
                            <motion.div
                                className={clsx(
                                    "px-8 py-6 rounded-xl shadow-xl text-center max-w-sm",
                                    isCorrect ? "bg-emerald-500/80" : "bg-rose-500/80"
                                )}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                            >
                                <h3 className="text-white text-2xl font-bold mb-2">
                                    {isCorrect ? "Correct!" : "Try Again!"}
                                </h3>
                                <p className="text-white/90 mb-4">
                                    {isCorrect
                                        ? `The word is indeed "${currentWord.original}"`
                                        : `The correct word was "${currentWord.original}"`
                                    }
                                </p>
                                <p className="text-white/80">
                                    {isCorrect
                                        ? `+10 points! Streak: ${streak}`
                                        : "You'll get it next time!"
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
