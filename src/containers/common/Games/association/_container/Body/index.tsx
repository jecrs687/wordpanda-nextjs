'use client';

import { memoryGameAction } from '@backend/domain/actions/Games/memory.action';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Clock, RefreshCw, Share2, Zap } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import GameButton from '../../../_components/GameButton';
import { LoadingGames } from '../../../_container/Loading';
import WordAssociationCard from '../../_components/WordAssociationCard';

type WordType = {
    id: string;
    word: string;
    definition: string;
    selected: boolean;
    matched: boolean;
};

// Animation variants
const cardGridVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 25 }
    }
};

export function Body({ words, lang, mediaId }: {
    words: { word: string; id?: string }[],
    lang: string,
    mediaId?: string
}) {
    const [gameWords, setGameWords] = useState<WordType[]>([]);
    const [selectedWords, setSelectedWords] = useState<WordType[]>([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120);
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [matchesFound, setMatchesFound] = useState(0);
    const [isGameLoading, setIsGameLoading] = useState(false);
    const [maxScore, setMaxScore] = useState(0);
    const [currentStreak, setCurrentStreak] = useState(0);

    // Prepare game with words
    const prepareGame = useCallback(() => {
        if (words.length < 6) return;

        setIsGameLoading(true);

        // Take a subset of words for the game
        const gameWordsCount = Math.min(12, words.length);
        const shuffledWords = [...words]
            .sort(() => Math.random() - 0.5)
            .slice(0, gameWordsCount)
            .map(word => ({
                id: word.id || Math.random().toString(36).substring(2),
                word: word.word,
                definition: 'Association match',
                selected: false,
                matched: false
            }));

        setGameWords(shuffledWords);
        setSelectedWords([]);
        setScore(0);
        setTimeLeft(120);
        setIsPlaying(true);
        setGameOver(false);
        setMatchesFound(0);
        setCurrentStreak(0);

        // Calculate max possible score
        setMaxScore(gameWordsCount * 10);

        setTimeout(() => {
            setIsGameLoading(false);
        }, 500);
    }, [words]);

    // Initialize game
    useEffect(() => {
        if (words.length > 0 && !isPlaying && !gameOver) {
            prepareGame();
        }
    }, [words, isPlaying, gameOver, prepareGame]);

    // Game timer
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (isPlaying && !gameOver) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setIsPlaying(false);
                        setGameOver(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [isPlaying, gameOver]);

    // Handle word selection
    const handleWordSelect = async (wordId: string) => {
        if (!isPlaying || gameOver) return;

        // Check if word is already selected or matched
        const selectedWord = gameWords.find(word => word.id === wordId);
        if (!selectedWord || selectedWord.matched || selectedWord.selected) return;

        // Update selected state
        setGameWords(prev =>
            prev.map(word =>
                word.id === wordId ? { ...word, selected: true } : word
            )
        );

        // Add to selected words
        const newSelectedWord = { ...selectedWord, selected: true };
        setSelectedWords(prev => [...prev, newSelectedWord]);

        // Check if we have a pair (2 selected words)
        if (selectedWords.length === 1) {
            // Check if words are related (for the game, we'll just check if they're different words)
            const isMatch = selectedWords[0].id !== newSelectedWord.id;

            if (isMatch) {
                // Found a match!
                setTimeout(async () => {
                    // Update matched status
                    setGameWords(prev =>
                        prev.map(word =>
                            word.selected ? { ...word, matched: true, selected: false } : word
                        )
                    );

                    // Clear selected words
                    setSelectedWords([]);

                    // Update current streak
                    setCurrentStreak(prev => prev + 1);

                    // Calculate bonus points based on streak
                    const streakBonus = Math.min(currentStreak * 2, 10); // Cap bonus at 10 points

                    // Update score with streak bonus
                    setScore(prev => prev + 10 + streakBonus);

                    // Update matches found
                    setMatchesFound(prev => prev + 1);

                    // Check if all matches found
                    if (matchesFound + 1 >= gameWords.length / 2) {
                        setIsPlaying(false);
                        setGameOver(true);
                    }

                    // Record success
                    try {
                        if (mediaId) {
                            await memoryGameAction({
                                wordId: selectedWords[0].id,
                                hard: false,
                                mediaId
                            });

                            await memoryGameAction({
                                wordId: newSelectedWord.id,
                                hard: false,
                                mediaId
                            });
                        }
                    } catch (error) {
                        console.error('Error recording word success:', error);
                    }
                }, 800);
            } else {
                // No match - reset streak
                setCurrentStreak(0);

                // No match
                setTimeout(() => {
                    // Reset selected status
                    setGameWords(prev =>
                        prev.map(word =>
                            word.selected && !word.matched ? { ...word, selected: false } : word
                        )
                    );

                    // Clear selected words
                    setSelectedWords([]);
                }, 1000);
            }
        }
    };

    // Format time as minutes:seconds
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Restart game
    const handleRestart = () => {
        prepareGame();
    };

    // Show loading state
    if (isGameLoading) {
        return <LoadingGames />;
    }

    // Render game UI
    return (
        <div className="w-full h-full">
            {/* Game Header with Score and Timer */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 px-4 py-3 flex items-center gap-3">
                    <div className="p-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-900/30">
                        <Share2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Score</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{score}</p>
                    </div>
                </div>

                {currentStreak > 1 && (
                    <div className="bg-amber-100/90 dark:bg-amber-900/30 backdrop-blur-sm rounded-lg border border-amber-200/50 dark:border-amber-800/50 px-4 py-3 flex items-center gap-3 animate-pulse">
                        <div className="p-1.5 rounded-full bg-amber-200/80 dark:bg-amber-800/30">
                            <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-xs text-amber-700 dark:text-amber-300">Streak</p>
                            <p className="text-xl font-bold text-amber-700 dark:text-amber-300">{currentStreak}x</p>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 px-4 py-3 flex items-center gap-3">
                        <div className="p-1.5 rounded-full bg-blue-100/80 dark:bg-blue-900/30">
                            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Time Left</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{formatTime(timeLeft)}</p>
                        </div>
                    </div>

                    <GameButton
                        onClick={handleRestart}
                        variant="outline"
                        size="sm"
                        icon={<RefreshCw className="h-4 w-4" />}
                    >
                        Restart
                    </GameButton>
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700/50 rounded-full mb-6 overflow-hidden">
                <motion.div
                    className="h-full bg-emerald-500 dark:bg-emerald-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${(matchesFound / (gameWords.length / 2)) * 100}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Word Grid */}
            <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4"
                variants={cardGridVariants}
                initial="hidden"
                animate="visible"
            >
                <AnimatePresence>
                    {gameWords.map((word) => (
                        <WordAssociationCard
                            key={word.id}
                            word={word.word}
                            isSelected={word.selected || word.matched}
                            isMatched={word.matched}
                            disabled={word.matched}
                            onClick={() => handleWordSelect(word.id)}
                            variants={cardVariants}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Game Over Modal */}
            <AnimatePresence>
                {gameOver && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl shadow-2xl p-6 max-w-md w-full border border-gray-200/50 dark:border-gray-700/50"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full mb-4">
                                    <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                                </div>

                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {matchesFound >= gameWords.length / 2 ? 'Great Job!' : 'Game Over!'}
                                </h2>

                                <p className="text-gray-600 dark:text-gray-300 mb-6">
                                    {matchesFound >= gameWords.length / 2
                                        ? 'You found all the word associations!'
                                        : 'You ran out of time, but keep practicing!'}
                                </p>

                                <div className="grid grid-cols-2 gap-4 w-full mb-6">
                                    <div className="bg-gray-100/80 dark:bg-gray-800/80 p-4 rounded-lg text-center">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Your Score</p>
                                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{score}</p>
                                    </div>

                                    <div className="bg-gray-100/80 dark:bg-gray-800/80 p-4 rounded-lg text-center">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Matches</p>
                                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            {matchesFound}/{gameWords.length / 2}
                                        </p>
                                    </div>

                                    <div className="bg-gray-100/80 dark:bg-gray-800/80 p-4 rounded-lg text-center">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Completion</p>
                                        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                            {Math.round((matchesFound / (gameWords.length / 2)) * 100)}%
                                        </p>
                                    </div>

                                    <div className="bg-gray-100/80 dark:bg-gray-800/80 p-4 rounded-lg text-center">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Time Used</p>
                                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                            {formatTime(120 - timeLeft)}
                                        </p>
                                    </div>
                                </div>

                                <GameButton
                                    onClick={handleRestart}
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    icon={<RefreshCw className="h-5 w-5" />}
                                >
                                    Play Again
                                </GameButton>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
