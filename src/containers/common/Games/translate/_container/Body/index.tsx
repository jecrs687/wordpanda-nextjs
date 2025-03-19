'use client';

import { Progress } from '@/components/ui/progress';
import Input from '@common/Input';
import { ROUTES } from '@constants/ROUTES';
import Button from '@core/Button';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, CheckCircle2, ChevronRight, Loader2, RefreshCw, XCircle } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface BodyProps {
    words: { word: string }[];
    lang: string;
    mediaId?: string;
}

export const Body = ({ words, lang, mediaId }: BodyProps) => {
    const { theme } = useTheme();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [loading, setLoading] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Shuffle words at the beginning
    const [shuffledWords, setShuffledWords] = useState<{ word: string }[]>([]);

    useEffect(() => {
        const shuffled = [...words].sort(() => Math.random() - 0.5);
        setShuffledWords(shuffled);
    }, [words]);

    useEffect(() => {
        // Focus input field when component mounts or after answering
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [currentIndex, result]);

    const checkAnswer = () => {
        if (!userInput.trim() || loading) return;

        setLoading(true);
        const currentWord = shuffledWords[currentIndex].word.toLowerCase();
        const userAnswer = userInput.toLowerCase().trim();

        // Simulate API call to check translation
        setTimeout(() => {
            // For demo purposes, we'll consider it correct if the input contains the word
            // In a real app, you'd check against actual translations
            const isCorrect = userAnswer.includes(currentWord) || currentWord.includes(userAnswer);

            setResult(isCorrect ? 'correct' : 'incorrect');
            if (isCorrect) {
                setScore(prev => prev + 1);
            }
            setAttempts(prev => prev + 1);
            setLoading(false);
        }, 800);
    };

    const handleNextWord = () => {
        setUserInput('');
        setResult(null);

        if (currentIndex < shuffledWords.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setGameCompleted(true);
        }
    };

    const restartGame = () => {
        const shuffled = [...words].sort(() => Math.random() - 0.5);
        setShuffledWords(shuffled);
        setCurrentIndex(0);
        setUserInput('');
        setResult(null);
        setScore(0);
        setAttempts(0);
        setGameCompleted(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (result) {
                handleNextWord();
            } else {
                checkAnswer();
            }
        }
    };

    const progressPercentage = (currentIndex / shuffledWords.length) * 100;

    if (gameCompleted) {
        return (
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col items-center justify-center h-full p-8"
                >
                    <motion.div
                        className="p-8 rounded-2xl bg-white/20 dark:bg-gray-900/50 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl max-w-md w-full"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <div className="text-center mb-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, rotate: 360 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                                className="inline-flex mb-4"
                            >
                                <Award className="h-16 w-16 text-emerald-500" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-2">
                                Translation Challenge Completed!
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-300">
                                You translated {score} out of {attempts} words correctly.
                            </p>
                            <div className="mt-4 p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30">
                                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                    {Math.round((score / attempts) * 100)}%
                                </p>
                                <p className="text-sm text-emerald-700 dark:text-emerald-300">Accuracy</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={restartGame}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Play Again
                            </Button>

                            <Link href={mediaId ? ROUTES.LANGUAGE(lang) : ROUTES.GAMES()} className="w-full">
                                <Button
                                    variant="outline"
                                    className="w-full border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all"
                                >
                                    Back to Games
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        );
    }

    if (shuffledWords.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-zinc-200/30 dark:border-zinc-800/30">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-800 dark:text-white">
                            Translation Challenge
                        </h2>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Translate the words from {lang} to your language
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 dark:bg-gray-900/40 backdrop-blur-sm px-4 py-2 rounded-full">
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">{score}</span>
                        <span className="text-zinc-400 dark:text-zinc-500">/</span>
                        <span className="text-zinc-600 dark:text-zinc-400">{attempts}</span>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                        <span>Progress</span>
                        <span>{currentIndex + 1} of {shuffledWords.length}</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2 bg-zinc-200 dark:bg-zinc-800">
                        <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </Progress>
                </div>
            </div>

            {/* Game Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-xl"
                    >
                        <div className="mb-8 text-center">
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                className="inline-block bg-white/30 dark:bg-gray-800/50 backdrop-blur-md px-8 py-6 rounded-2xl shadow-lg border border-zinc-200/50 dark:border-zinc-700/30"
                            >
                                <h3 className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                                    Translate this word
                                </h3>
                                <p className="text-3xl font-bold text-zinc-800 dark:text-white">
                                    {shuffledWords[currentIndex].word}
                                </p>
                            </motion.div>
                        </div>

                        <div className="mb-6">
                            <div className="relative">
                                <Input
                                    ref={inputRef}
                                    type="text"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type your translation here..."
                                    disabled={loading || !!result}
                                    className={`w-full px-4 py-3 rounded-xl text-lg ${result === 'correct'
                                        ? 'border-emerald-500 dark:border-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/20'
                                        : result === 'incorrect'
                                            ? 'border-rose-500 dark:border-rose-400 bg-rose-50/50 dark:bg-rose-900/20'
                                            : 'border-zinc-300 dark:border-zinc-700 bg-white/70 dark:bg-gray-900/50'
                                        } backdrop-blur-sm focus:ring-2 focus:ring-emerald-400/30 dark:focus:ring-emerald-400/20 focus:outline-none transition-all`}
                                />

                                {result && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    >
                                        {result === 'correct' ? (
                                            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                                        ) : (
                                            <XCircle className="h-6 w-6 text-rose-500" />
                                        )}
                                    </motion.div>
                                )}

                                {loading && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
                                    </div>
                                )}
                            </div>

                            {result === 'incorrect' && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-2 text-sm text-rose-500 dark:text-rose-400"
                                >
                                    The correct translation was &quot;{shuffledWords[currentIndex].word}&quot;.
                                </motion.p>
                            )}
                        </div>

                        <div className="flex justify-center">
                            {!result ? (
                                <Button
                                    onClick={checkAnswer}
                                    disabled={!userInput.trim() || loading}
                                    className={`px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium flex items-center gap-2 transition-all ${!userInput.trim() || loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg shadow-emerald-500/20'
                                        }`}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Checking...
                                        </>
                                    ) : (
                                        <>
                                            Check Answer
                                        </>
                                    )}
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleNextWord}
                                    className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium flex items-center gap-2 transition-all hover:shadow-lg shadow-indigo-500/20"
                                >
                                    {currentIndex < shuffledWords.length - 1 ? (
                                        <>
                                            Next Word
                                            <ChevronRight className="h-4 w-4" />
                                        </>
                                    ) : (
                                        <>
                                            Complete
                                            <Award className="h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};