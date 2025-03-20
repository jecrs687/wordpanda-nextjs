'use client';

import { Progress } from '@/components/ui/progress';
import { memoryGameAction } from '@backend/domain/actions/Games/memory.action';
import { getWords } from '@backend/domain/actions/Word/getWords.action';
import { ROUTES } from '@constants/ROUTES';
import Button from '@core/Button';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { WordWithTranslationsAndUserWords } from 'src/app/api/words/route';

interface LetterTile {
    id: string;
    letter: string;
    isSelected: boolean;
}

export const Body = ({ words, lang, mediaId }: { words: { word: string }[], lang: string, mediaId?: string }) => {
    const { theme } = useTheme();
    const [allWords, setAllWords] = useState<WordWithTranslationsAndUserWords[]>([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [scrambledLetters, setScrambledLetters] = useState<LetterTile[]>([]);
    const [userAnswer, setUserAnswer] = useState<LetterTile[]>([]);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [isGameCompleted, setIsGameCompleted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const updateWords = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getWords({
                language: lang,
                mediaId,
                limit: 15
            });
            setAllWords(response.data.words);
        } catch (error) {
            console.error("Failed to fetch words:", error);
        } finally {
            setIsLoading(false);
        }
    }, [lang, mediaId]);

    useEffect(() => {
        updateWords();
    }, [updateWords]);

    useEffect(() => {
        if (allWords.length > 0) {
            scrambleCurrentWord();
        }
    }, [allWords, currentWordIndex]);

    const scrambleCurrentWord = () => {
        if (!allWords[currentWordIndex]) return;

        const word = allWords[currentWordIndex].word;
        // Create array of letter objects with unique IDs
        const letters = word.split('').map((letter, index) => ({
            id: `${letter}-${index}-${Math.random().toString(36).substring(2, 8)}`,
            letter,
            isSelected: false
        }));

        // Shuffle the letters
        const shuffled = [...letters].sort(() => Math.random() - 0.5);
        setScrambledLetters(shuffled);
        setUserAnswer([]);
        setIsCorrect(null);
    };

    const handleLetterClick = (letter: LetterTile) => {
        if (isCorrect !== null) return; // Prevent interaction after answer is submitted

        // If letter is in the scrambled set and not already selected
        if (!letter.isSelected) {
            // Add to user answer
            setUserAnswer(prev => [...prev, letter]);

            // Mark as selected in the scrambled set
            setScrambledLetters(prev =>
                prev.map(l => l.id === letter.id ? { ...l, isSelected: true } : l)
            );
        }
    };

    const handleAnswerLetterClick = (letter: LetterTile, index: number) => {
        if (isCorrect !== null) return; // Prevent interaction after answer is submitted

        // Remove from user answer
        setUserAnswer(prev => prev.filter((_, i) => i !== index));

        // Mark as not selected in the scrambled set
        setScrambledLetters(prev =>
            prev.map(l => l.id === letter.id ? { ...l, isSelected: false } : l)
        );
    };

    const checkAnswer = () => {
        if (userAnswer.length === 0) return;

        const userWord = userAnswer.map(tile => tile.letter).join('');
        const correctWord = allWords[currentWordIndex].word;
        const correct = userWord.toLowerCase() === correctWord.toLowerCase();

        setIsCorrect(correct);
        setAttempts(prev => prev + 1);

        if (correct) {
            setScore(prev => prev + 1);
        }

        // Record the result for memory tracking
        memoryGameAction({
            wordId: allWords[currentWordIndex].id,
            hard: !correct,
            mediaId
        });

        // Move to next word after delay
        setTimeout(() => {
            if (currentWordIndex < allWords.length - 1) {
                setCurrentWordIndex(prev => prev + 1);
            } else {
                setIsGameCompleted(true);
            }
            setIsCorrect(null);
        }, 1500);
    };

    const restartGame = () => {
        setCurrentWordIndex(0);
        setScore(0);
        setAttempts(0);
        setIsGameCompleted(false);
        setIsCorrect(null);
        updateWords();
    };

    if (isLoading || allWords.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center"
                >
                    <Loader2 className="h-12 w-12 text-emerald-500 animate-spin mb-4" />
                    <p className="text-zinc-600 dark:text-zinc-300 text-lg">Loading word scramble...</p>
                </motion.div>
            </div>
        );
    }

    if (isGameCompleted) {
        return (
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col items-center justify-center min-h-[60vh] p-6 md:p-8"
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
                                Word Scramble Completed!
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-300">
                                You unscrambled {score} out of {attempts} words correctly.
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

    const progressPercentage = (currentWordIndex / allWords.length) * 100;
    const currentWord = allWords[currentWordIndex]?.word || '';

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-zinc-200/30 dark:border-zinc-800/30">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-800 dark:text-white">
                            Word Scramble
                        </h2>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Unscramble words in {lang}
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
                        <span>{currentWordIndex + 1} of {allWords.length}</span>
                    </div>
                    <Progress value={progressPercentage} />
                </div>
            </div>

            {/* Game Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentWordIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-xl"
                    >
                        {/* User's answer area */}
                        <div className="mb-8">
                            <div className="flex justify-center mb-2">
                                <div className={`p-5 rounded-xl ${isCorrect === true
                                        ? 'bg-emerald-500/20 border border-emerald-500/30'
                                        : isCorrect === false
                                            ? 'bg-rose-500/20 border border-rose-500/30'
                                            : 'bg-white/20 dark:bg-gray-800/30 border border-zinc-200/30 dark:border-zinc-700/30'
                                    } min-h-[80px] w-full flex items-center justify-center transition-all duration-300`}>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {userAnswer.length > 0 ? (
                                            userAnswer.map((letter, index) => (
                                                <motion.div
                                                    key={letter.id}
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                                    onClick={() => handleAnswerLetterClick(letter, index)}
                                                    className={`relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg cursor-pointer shadow-sm font-bold text-lg ${isCorrect === true
                                                            ? 'bg-emerald-500 text-white'
                                                            : isCorrect === false
                                                                ? 'bg-rose-500 text-white'
                                                                : 'bg-indigo-500/90 text-white hover:bg-indigo-600 dark:hover:bg-indigo-400'
                                                        } transition-all`}
                                                >
                                                    {letter.letter.toUpperCase()}
                                                    {isCorrect === null && (
                                                        <motion.span
                                                            className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full 
                                                            flex items-center justify-center text-white text-xs font-bold"
                                                            initial={{ opacity: 0, scale: 0 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0 }}
                                                        >
                                                            ×
                                                        </motion.span>
                                                    )}
                                                </motion.div>
                                            ))
                                        ) : (
                                            <span className="text-zinc-500 dark:text-zinc-400 text-sm">
                                                Click letters below to form the word
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {isCorrect === false && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center text-rose-500 mb-4"
                                >
                                    <p>The correct word was: <span className="font-bold">{currentWord}</span></p>
                                </motion.div>
                            )}

                            {isCorrect === true && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center text-emerald-500 mb-4 flex items-center justify-center gap-2"
                                >
                                    <Sparkles className="h-4 w-4" />
                                    <span>Correct!</span>
                                </motion.div>
                            )}
                        </div>

                        {/* Scrambled letters */}
                        <div className="mb-8">
                            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                                {scrambledLetters.map((letter) => (
                                    <motion.div
                                        key={letter.id}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{
                                            opacity: letter.isSelected ? 0.3 : 1,
                                            scale: letter.isSelected ? 0.9 : 1,
                                            y: letter.isSelected ? 5 : 0
                                        }}
                                        onClick={() => !letter.isSelected && handleLetterClick(letter)}
                                        className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg cursor-pointer 
                                        ${letter.isSelected
                                                ? 'bg-zinc-300/50 dark:bg-zinc-700/30 text-zinc-500 dark:text-zinc-400 cursor-not-allowed'
                                                : 'bg-white/80 dark:bg-gray-800/80 text-zinc-800 dark:text-white shadow-md hover:shadow-lg hover:-translate-y-1'
                                            } font-bold text-lg transition-all duration-200`}
                                    >
                                        {letter.letter.toUpperCase()}
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-center">
                            <Button
                                onClick={checkAnswer}
                                disabled={userAnswer.length === 0 || isCorrect !== null}
                                className={`px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium 
                                transition-all ${userAnswer.length === 0 || isCorrect !== null ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'}`}
                            >
                                Check Answer
                            </Button>

                            <Button
                                onClick={scrambleCurrentWord}
                                className="ml-3 px-4 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 
                                text-zinc-700 dark:text-zinc-300 font-medium transition-all"
                            >
                                <RefreshCw className="h-4 w-4" />
                                <span className="ml-2 hidden md:inline">Reshuffle</span>
                            </Button>
                        </div>

                        {/* Hint area */}
                        <div className="mt-6 text-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-sm text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
                                onClick={() => {
                                    // Reveal first letter as hint
                                    const firstLetter = scrambledLetters.find(l =>
                                        l.letter.toLowerCase() === currentWord.charAt(0).toLowerCase() && !l.isSelected
                                    );
                                    if (firstLetter) handleLetterClick(firstLetter);
                                }}
                            >
                                Need a hint?
                            </motion.button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
