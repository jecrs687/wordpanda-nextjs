'use client';

import { Progress } from '@/components/ui/progress';
import { memoryGameAction } from '@backend/domain/actions/Games/memory.action';
import { getWords } from '@backend/domain/actions/Word/getWords.action';
import { ROUTES } from '@constants/ROUTES';
import Button from '@core/Button';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, Loader2, RefreshCw, Sparkles, Volume2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { WordWithTranslationsAndUserWords } from 'src/app/api/words/route';

interface WordTile {
    id: string;
    word: string;
    isSelected: boolean;
}

// Helper function to generate sentence fragments from a word's translation.example
const generateSentenceFragments = (example: string) => {
    if (!example) return [];
    // Split by spaces and some punctuation, but keep punctuation attached to words
    return example.split(/\s+(?=[^.,;:!?])|(?<=[.,;:!?])\s+/)
        .filter(word => word.trim().length > 0)
        .map((word, index) => ({
            id: `word-${index}-${Math.random().toString(36).substring(2, 8)}`,
            word: word.trim(),
            isSelected: false
        }));
};

export const Body = ({ words, lang, mediaId }: { words: { word: string }[], lang: string, mediaId?: string }) => {
    const { theme } = useTheme();
    const [allWords, setAllWords] = useState<WordWithTranslationsAndUserWords[]>([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [shuffledFragments, setShuffledFragments] = useState<WordTile[]>([]);
    const [userAnswer, setUserAnswer] = useState<WordTile[]>([]);
    const [correctSentence, setCorrectSentence] = useState<string>('');
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

            // Filter words that have translations with examples
            const wordsWithExamples = response.data.words.filter(
                word => word.translations &&
                    word.translations.length > 0 &&
                    'example' in word.translations[0] && word.translations[0].example
            );

            if (wordsWithExamples.length === 0) {
                // Not enough words with examples, just use regular words
                setAllWords(response.data.words);
            } else {
                setAllWords(wordsWithExamples);
            }
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
            prepareSentence();
        }
    }, [allWords, currentWordIndex]);

    const prepareSentence = () => {
        if (!allWords[currentWordIndex]) return;

        const currentWord = allWords[currentWordIndex];
        let example = '';

        // Try to get an example from translations
        if (currentWord.translations && currentWord.translations.length > 0 && currentWord.translations[0].meaning) {
            example = (currentWord as any).translations[0].meaning;
        } else {
            // If no example, create a simple sentence with the word
            example = `This is an example sentence using the word "${currentWord.word}".`;
        }

        setCorrectSentence(example);

        // Generate fragments from the example
        const fragments = generateSentenceFragments(example);

        // Shuffle the fragments
        const shuffled = [...fragments].sort(() => Math.random() - 0.5);
        setShuffledFragments(shuffled);
        setUserAnswer([]);
        setIsCorrect(null);
    };

    const handleFragmentClick = (fragment: WordTile) => {
        if (isCorrect !== null) return; // Prevent interaction after answer is submitted

        // If fragment is in the shuffled set and not already selected
        if (!fragment.isSelected) {
            // Add to user answer
            setUserAnswer(prev => [...prev, fragment]);

            // Mark as selected in the shuffled set
            setShuffledFragments(prev =>
                prev.map(f => f.id === fragment.id ? { ...f, isSelected: true } : f)
            );
        }
    };

    const handleAnswerFragmentClick = (fragment: WordTile, index: number) => {
        if (isCorrect !== null) return; // Prevent interaction after answer is submitted

        // Remove from user answer
        setUserAnswer(prev => prev.filter((_, i) => i !== index));

        // Mark as not selected in the shuffled set
        setShuffledFragments(prev =>
            prev.map(f => f.id === fragment.id ? { ...f, isSelected: false } : f)
        );
    };

    const checkAnswer = () => {
        if (userAnswer.length === 0) return;

        const userSentence = userAnswer.map(tile => tile.word).join(' ');

        // Normalize both strings for comparison (remove punctuation, lowercase)
        const normalizeString = (str: string) =>
            str.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').replace(/\s{2,}/g, ' ').trim();

        const normalizedUser = normalizeString(userSentence);
        const normalizedCorrect = normalizeString(correctSentence);

        // Check if the normalized strings match
        const correct = normalizedUser === normalizedCorrect;

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
        }, 2000);
    };

    const speakSentence = () => {
        if (!correctSentence) return;

        const utterance = new SpeechSynthesisUtterance(correctSentence);
        utterance.lang = lang === 'en' ? 'en-US' : lang; // Set the language
        speechSynthesis.speak(utterance);
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
                    <p className="text-zinc-600 dark:text-zinc-300 text-lg">Loading sentence builder...</p>
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
                                Sentence Builder Completed!
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-300">
                                You correctly built {score} out of {attempts} sentences.
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
                            Sentence Builder
                        </h2>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Build sentences with words in {lang}
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
                        {/* Word context */}
                        <div className="mb-6 text-center">
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                className="inline-block bg-indigo-500/10 dark:bg-indigo-800/20 backdrop-blur-md px-5 py-3 rounded-xl border border-indigo-200/50 dark:border-indigo-700/30"
                            >
                                <h3 className="text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-300 mb-1">
                                    Create a sentence with
                                </h3>
                                <p className="text-xl font-bold text-indigo-700 dark:text-indigo-300">
                                    {currentWord}
                                </p>
                            </motion.div>
                        </div>

                        {/* User's answer area */}
                        <div className="mb-8">
                            <div className="flex justify-center mb-2">
                                <div className={`p-5 rounded-xl ${isCorrect === true
                                    ? 'bg-emerald-500/20 border border-emerald-500/30'
                                    : isCorrect === false
                                        ? 'bg-rose-500/20 border border-rose-500/30'
                                        : 'bg-white/20 dark:bg-gray-800/30 border border-zinc-200/30 dark:border-zinc-700/30'
                                    } min-h-[100px] w-full flex items-center justify-center transition-all duration-300`}>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {userAnswer.length > 0 ? (
                                            <div className="flex flex-wrap justify-center gap-2">
                                                {userAnswer.map((fragment, index) => (
                                                    <motion.div
                                                        key={fragment.id}
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                                        onClick={() => handleAnswerFragmentClick(fragment, index)}
                                                        className={`relative py-2 px-3 flex items-center justify-center rounded-lg cursor-pointer shadow-sm 
                                                        ${isCorrect === true
                                                                ? 'bg-emerald-500 text-white'
                                                                : isCorrect === false
                                                                    ? 'bg-rose-500 text-white'
                                                                    : 'bg-cyan-500/90 text-white hover:bg-cyan-600 dark:hover:bg-cyan-400'
                                                            } transition-all text-sm md:text-base font-medium`}
                                                    >
                                                        {fragment.word}
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
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-zinc-500 dark:text-zinc-400 text-sm">
                                                Click words below to form a sentence
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
                                    <p className="mb-2">The correct sentence was:</p>
                                    <p className="font-medium bg-white/20 dark:bg-black/20 p-3 rounded-lg italic">
                                        &quot;{correctSentence}&quot;
                                    </p>
                                    <button
                                        onClick={speakSentence}
                                        className="mt-2 inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-300"
                                    >
                                        <Volume2 className="h-4 w-4" />
                                        <span>Listen</span>
                                    </button>
                                </motion.div>
                            )}

                            {isCorrect === true && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center text-emerald-500 mb-4 flex flex-col items-center justify-center gap-2"
                                >
                                    <div className="flex items-center">
                                        <Sparkles className="h-4 w-4 mr-1" />
                                        <span>Perfect sentence!</span>
                                    </div>
                                    <button
                                        onClick={speakSentence}
                                        className="mt-1 inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-300"
                                    >
                                        <Volume2 className="h-4 w-4" />
                                        <span>Listen</span>
                                    </button>
                                </motion.div>
                            )}
                        </div>

                        {/* Sentence fragments */}
                        <div className="mb-8">
                            <div className="flex flex-wrap justify-center gap-2">
                                {shuffledFragments.map((fragment) => (
                                    <motion.div
                                        key={fragment.id}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{
                                            opacity: fragment.isSelected ? 0.3 : 1,
                                            scale: fragment.isSelected ? 0.9 : 1,
                                            y: fragment.isSelected ? 5 : 0
                                        }}
                                        onClick={() => !fragment.isSelected && handleFragmentClick(fragment)}
                                        className={`py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 text-sm md:text-base
                                        ${fragment.isSelected
                                                ? 'bg-zinc-300/50 dark:bg-zinc-700/30 text-zinc-500 dark:text-zinc-400 cursor-not-allowed'
                                                : 'bg-white/80 dark:bg-gray-800/80 text-zinc-800 dark:text-white shadow-md hover:shadow-lg hover:-translate-y-1 font-medium'
                                            }`}
                                    >
                                        {fragment.word}
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
                                Check Sentence
                            </Button>

                            <Button
                                onClick={prepareSentence}
                                className="ml-3 px-4 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 
                                text-zinc-700 dark:text-zinc-300 font-medium transition-all"
                            >
                                <RefreshCw className="h-4 w-4" />
                                <span className="ml-2 hidden md:inline">Reshuffle</span>
                            </Button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
