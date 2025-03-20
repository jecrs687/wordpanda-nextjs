'use client';
import { memoryGameAction } from '@backend/domain/actions/Games/memory.action';
import { getWords } from '@backend/domain/actions/Word/getWords.action';
import LoaderSpinner from '@core/LoaderSpinner';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { WordWithTranslationsAndUserWords } from 'src/app/api/words/route';

type ChainWord = {
    id: string;
    word: string;
    meaning: string;
    selected: boolean;
    position: number | null;
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
    const [gameWords, setGameWords] = useState<ChainWord[]>([]);
    const [selectedWords, setSelectedWords] = useState<ChainWord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isGameActive, setIsGameActive] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [levelWordsCount, setLevelWordsCount] = useState(6);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

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

    // Prepare game level
    const prepareLevel = useCallback(() => {
        if (allWords.length < levelWordsCount) {
            fetchWords();
            return;
        }

        setIsLoading(true);

        // Select words for this level
        const levelWords = allWords
            .slice(0, levelWordsCount)
            .map((word, index) => ({
                id: word.id,
                word: word.word,
                meaning: word.translations?.[0]?.meaning || 'No definition available',
                selected: false,
                position: null
            }));

        setGameWords(levelWords);
        setSelectedWords([]);

        // Remove used words from the pool
        setAllWords(prev => prev.slice(levelWordsCount));

        // Reset timer and start game
        setTimeLeft(60 + (level - 1) * 15); // More time for higher levels
        setIsGameActive(true);

        setIsLoading(false);
    }, [allWords, fetchWords, level, levelWordsCount]);

    // Initialize game
    useEffect(() => {
        if (allWords.length === 0) {
            fetchWords();
        }
    }, [allWords.length, fetchWords]);

    // Set up level
    useEffect(() => {
        if (!isLoading && allWords.length >= levelWordsCount && !isGameActive && !gameCompleted) {
            prepareLevel();
        }
    }, [isLoading, allWords.length, levelWordsCount, isGameActive, gameCompleted, prepareLevel]);

    // Timer
    useEffect(() => {
        if (isGameActive) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current!);
                        setIsGameActive(false);

                        // Check if player completed the level
                        if (selectedWords.length === levelWordsCount) {
                            if (level >= 3) {
                                setGameCompleted(true);
                            } else {
                                setLevel(prev => prev + 1);
                                setLevelWordsCount(prev => Math.min(prev + 2, 12)); // Increase difficulty
                            }
                        } else {
                            setGameCompleted(true); // Game over if time ran out
                        }

                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => {
                if (timerRef.current) clearInterval(timerRef.current);
            };
        }
    }, [isGameActive, level, levelWordsCount, selectedWords.length]);

    // Handle word selection
    const handleWordSelect = async (word: ChainWord) => {
        if (!isGameActive || word.selected) return;

        // Add the word to the chain
        const newSelectedWords = [...selectedWords, {
            ...word,
            selected: true,
            position: selectedWords.length
        }];

        setSelectedWords(newSelectedWords);

        // Update the word in gameWords
        setGameWords(prev =>
            prev.map(w =>
                w.id === word.id
                    ? { ...w, selected: true, position: selectedWords.length }
                    : w
            )
        );

        // Record word learning progress
        try {
            await memoryGameAction({
                wordId: word.id,
                hard: false,
                mediaId
            });
        } catch (error) {
            console.error("Error recording word progress:", error);
        }

        // Update score
        setScore(prev => prev + (10 * level));

        // Check if level completed
        if (newSelectedWords.length === levelWordsCount) {
            setIsGameActive(false);

            // Bonus for completing before time runs out
            const timeBonus = timeLeft * level;
            setScore(prev => prev + timeBonus);

            // Go to next level or complete game
            setTimeout(() => {
                if (level >= 3) {
                    setGameCompleted(true);
                } else {
                    setLevel(prev => prev + 1);
                    setLevelWordsCount(prev => Math.min(prev + 2, 12)); // Increase difficulty
                }
            }, 1500);
        }
    };

    // Remove the last word from the chain
    const undoLastSelection = () => {
        if (!isGameActive || selectedWords.length === 0) return;

        const lastWord = selectedWords[selectedWords.length - 1];

        // Remove from selected words
        setSelectedWords(prev => prev.slice(0, -1));

        // Update in gameWords
        setGameWords(prev =>
            prev.map(w =>
                w.id === lastWord.id
                    ? { ...w, selected: false, position: null }
                    : w
            )
        );
    };

    const restartGame = () => {
        setScore(0);
        setLevel(1);
        setLevelWordsCount(6);
        setGameCompleted(false);
        setIsGameActive(false);
        prepareLevel();
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <LoaderSpinner size="large" />
                    <p className="mt-4 text-zinc-300 dark:text-zinc-400">
                        Loading word chains game...
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
                        You've completed all word chain challenges!
                    </p>

                    <div className="flex justify-center">
                        <motion.button
                            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-medium rounded-lg shadow-lg"
                            onClick={restartGame}
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
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="bg-gray-800/70 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="text-emerald-400 font-medium">Level {level}/3</span>
                        </div>

                        <div className="bg-gray-800/70 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="text-white font-medium">Score: <span className="text-emerald-400">{score}</span></span>
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex items-center"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="bg-gray-800/70 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <span className={clsx(
                                "font-medium",
                                timeLeft < 10 ? "text-rose-400" : "text-white"
                            )}>
                                {timeLeft}s
                            </span>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    className="mt-4 text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="text-white text-xl font-medium">Create a chain of words</h2>
                    <p className="text-zinc-400 text-sm mt-1">Select each word to add to your chain before time runs out</p>
                </motion.div>
            </div>

            {/* Selected words chain */}
            {selectedWords.length > 0 && (
                <motion.div
                    className="w-full max-w-4xl mb-8"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-xl p-4 shadow-lg">
                        <h3 className="text-zinc-300 text-sm uppercase tracking-wider mb-3 text-center">Your Word Chain</h3>

                        <div className="flex flex-wrap justify-center gap-3">
                            {selectedWords.map((word, idx) => (
                                <motion.div
                                    key={`chain-${word.id}`}
                                    className="px-3 py-2 bg-indigo-600/60 border border-indigo-400/50 rounded-lg flex items-center gap-2"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 * idx }}
                                >
                                    <span className="w-5 h-5 flex items-center justify-center bg-indigo-300/30 rounded-full text-xs font-bold text-white">
                                        {idx + 1}
                                    </span>
                                    <span className="text-white font-medium">{word.word}</span>
                                </motion.div>
                            ))}

                            {selectedWords.length < levelWordsCount && (
                                <motion.div
                                    className="px-3 py-2 bg-gray-800/40 border border-gray-700/50 rounded-lg flex items-center"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 * selectedWords.length }}
                                >
                                    <span className="text-zinc-400 font-medium">+ {levelWordsCount - selectedWords.length} more</span>
                                </motion.div>
                            )}
                        </div>

                        {selectedWords.length > 0 && (
                            <div className="flex justify-center mt-3">
                                <motion.button
                                    className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-700/60 text-zinc-300 hover:bg-gray-700/80 transition-all"
                                    onClick={undoLastSelection}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                    </svg>
                                    <span>Undo Last</span>
                                </motion.button>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Available words grid */}
            <motion.div
                className="w-full max-w-4xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
                    {gameWords.map((word, idx) => (
                        <motion.button
                            key={word.id}
                            className={clsx(
                                "py-4 px-4 rounded-lg backdrop-blur-sm shadow-md border-2 transition-all flex flex-col",
                                word.selected
                                    ? "bg-emerald-600/20 border-emerald-400/30 cursor-default"
                                    : "bg-gray-800/40 border-gray-700/50 hover:bg-gray-700/60 cursor-pointer"
                            )}
                            onClick={() => !word.selected && handleWordSelect(word)}
                            disabled={word.selected}
                            whileHover={!word.selected ? { y: -4, scale: 1.02 } : {}}
                            whileTap={!word.selected ? { scale: 0.98 } : {}}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{
                                opacity: word.selected ? 0.7 : 1,
                                y: 0,
                                transition: { delay: idx * 0.1 }
                            }}
                        >
                            <h3 className="text-white font-bold mb-2">{word.word}</h3>
                            <p className="text-zinc-300 text-sm line-clamp-2">{word.meaning}</p>

                            {word.selected && (
                                <div className="absolute top-2 right-2">
                                    <div className="w-6 h-6 flex items-center justify-center bg-emerald-500/80 rounded-full">
                                        <span className="text-white text-xs font-bold">{word.position! + 1}</span>
                                    </div>
                                </div>
                            )}
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};
