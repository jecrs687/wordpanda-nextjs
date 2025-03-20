'use client';

import { Progress } from '@/components/ui/progress';
import { memoryGameAction } from '@backend/domain/actions/Games/memory.action';
import { quizGameAction } from '@backend/domain/actions/Games/quiz.action';
import { getWords } from '@backend/domain/actions/Word/getWords.action';
import { ROUTES } from '@constants/ROUTES';
import Button from '@core/Button';
import { WordGameQuiz } from '@prisma/client';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, Check, ChevronRight, Loader2, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { WordWithTranslationsAndUserWords } from 'src/app/api/words/route';

export const Body = ({ lang, mediaId }: { lang: string, mediaId?: string }) => {
    const { theme } = useTheme();
    const [quizList, setQuizList] = useState<WordGameQuiz[]>([]);
    const [index, setIndex] = useState<number>(0);
    const [option, setOption] = useState<WordGameQuiz & { options: { value: string, correct: boolean }[] }>();
    const [selected, setSelected] = useState<number | undefined>(undefined);
    const [allWords, setAllWords] = useState<WordWithTranslationsAndUserWords[]>([]);
    const [score, setScore] = useState<number>(0);
    const [attempts, setAttempts] = useState<number>(0);
    const [isGameCompleted, setIsGameCompleted] = useState<boolean>(false);

    const updateWords = useCallback(async () => {
        const response = await getWords({
            language: lang,
            mediaId,
            limit: 20
        });
        setAllWords(prev => [...prev, ...response.data.words]);
    }, [mediaId, lang]);

    useEffect(() => {
        if (index === allWords.length) updateWords();
    }, [index, allWords, updateWords]);

    const getNewQuiz = useCallback(async () => {
        const response = await quizGameAction({
            words: allWords.map(word => word.id).slice(
                quizList.length,
                quizList.length + 4
            ),
        });

        const quiz = response.data.words.map(({ wordGameQuiz }) => wordGameQuiz).flat();
        setQuizList(prev => [...prev, ...quiz]);
    }, [allWords, quizList]);

    useEffect(() => {
        if (!allWords.length) return;
        if (index === allWords.length) return;
        if (index + 4 > quizList.length) getNewQuiz();
    }, [allWords, index, getNewQuiz, quizList]);

    useEffect(() => {
        if (!quizList.length) return;
        if (!quizList[index]) return;
        const current = quizList[index];
        const options: any = current.options?.map((value, index) => ({
            value,
            correct: current.answer === value
        }));
        const findCorrect = options.find((option: { correct: boolean }) => option.correct);
        if (!findCorrect) {
            options.pop();
            options.push({ value: current.answer, correct: true });
        }
        setOption({ ...current, options: options?.sort(() => Math.random() - 0.5) });
    }, [index, quizList]);

    const handleOptionSelect = (answer: { value: string, correct: boolean }, i: number) => {
        memoryGameAction({
            wordId: quizList[index].wordId,
            hard: !answer.correct,
            mediaId
        });
        setSelected(i);
        setAttempts(prev => prev + 1);

        if (answer.correct) {
            setScore(prev => prev + 1);
        }

        setTimeout(() => {
            setSelected(undefined);
            if (answer.correct) {
                if (index + 1 < quizList.length) {
                    setIndex(prev => prev + 1);
                } else {
                    setIsGameCompleted(true);
                }
            }
        }, 1000);
    };

    const restartGame = () => {
        setIndex(0);
        setScore(0);
        setAttempts(0);
        setIsGameCompleted(false);
        setSelected(undefined);
    };

    // Loading state
    if (!allWords?.length || !quizList.length) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center"
                >
                    <Loader2 className="h-12 w-12 text-emerald-500 animate-spin mb-4" />
                    <p className="text-zinc-600 dark:text-zinc-300 text-lg">Loading translation challenge...</p>
                </motion.div>
            </div>
        );
    }

    // Game completed state
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
                                <ChevronRight className="h-4 w-4" />
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

    // Calculate progress
    const progressPercentage = (index / quizList.length) * 100;

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
                            Translate words from {lang} to your language
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
                        <span>{index + 1} of {quizList.length}</span>
                    </div>
                    <Progress value={progressPercentage} />
                </div>
            </div>

            {/* Game Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
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
                                    {allWords?.find(word => word.id === quizList[index]?.wordId)?.word}
                                </p>
                                {quizList[index]?.phrase && (
                                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 italic">
                                        &quot;{quizList[index].phrase}&quot;
                                    </p>
                                )}
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {option?.options?.map((answer, i) => (
                                <motion.button
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => selected === undefined && handleOptionSelect(answer, i)}
                                    className={`relative p-4 md:p-5 rounded-xl text-left transition-all transform font-medium text-lg
                                        ${selected === i && answer.correct ?
                                            'bg-emerald-500/90 dark:bg-emerald-600/80 text-white scale-105 shadow-lg' :
                                            selected === i && !answer.correct ?
                                                'bg-rose-500/90 dark:bg-rose-600/80 text-white scale-95' :
                                                selected !== undefined ?
                                                    'bg-white/20 dark:bg-gray-800/40 text-zinc-500 dark:text-zinc-400 cursor-not-allowed opacity-70' :
                                                    'bg-white/40 dark:bg-gray-800/50 text-zinc-800 dark:text-white hover:bg-indigo-500/80 dark:hover:bg-indigo-600/70 hover:text-white hover:shadow-md hover:scale-102 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-700/30'
                                        }`}
                                    disabled={selected !== undefined}
                                >
                                    {answer.value}

                                    {selected === i && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-3 right-3"
                                        >
                                            {answer.correct ? (
                                                <Check className="h-5 w-5 text-white" />
                                            ) : (
                                                <X className="h-5 w-5 text-white" />
                                            )}
                                        </motion.div>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};