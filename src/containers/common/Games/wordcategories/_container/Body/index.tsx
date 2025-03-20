'use client';
import { memoryGameAction } from '@backend/domain/actions/Games/memory.action';
import { getWords } from '@backend/domain/actions/Word/getWords.action';
import LoaderSpinner from '@core/LoaderSpinner';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { WordWithTranslationsAndUserWords } from 'src/app/api/words/route';

// Define some common categories for sorting words
const CATEGORIES = [
    { id: 'food', name: 'Food', keywords: ['eat', 'food', 'meal', 'fruit', 'vegetable', 'drink', 'cook'] },
    { id: 'travel', name: 'Travel', keywords: ['travel', 'trip', 'journey', 'vacation', 'tourism', 'flight', 'hotel'] },
    { id: 'nature', name: 'Nature', keywords: ['nature', 'animal', 'plant', 'tree', 'flower', 'forest', 'mountain'] },
    { id: 'technology', name: 'Technology', keywords: ['tech', 'computer', 'phone', 'internet', 'digital', 'software', 'device'] },
    { id: 'clothes', name: 'Clothing', keywords: ['clothes', 'fashion', 'wear', 'dress', 'shirt', 'pants', 'shoe'] },
    { id: 'home', name: 'Home', keywords: ['home', 'house', 'room', 'furniture', 'kitchen', 'bedroom', 'living'] },
];

type GameWord = {
    id: string;
    word: string;
    meaning: string;
    category: string;
    allocated: boolean;
};

type CategoryScore = {
    id: string;
    name: string;
    total: number;
    correct: number;
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
    const [gameWords, setGameWords] = useState<GameWord[]>([]);
    const [currentCategory, setCurrentCategory] = useState<string | null>(null);
    const [categoryScores, setCategoryScores] = useState<CategoryScore[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const [feedback, setFeedback] = useState<{ wordId: string, isCorrect: boolean } | null>(null);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Fetch words
    const fetchWords = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getWords({
                language: lang,
                ...(mediaId ? { mediaId } : { words: words.slice(currentIndex, currentIndex + 30).map(x => x.word) }),
                limit: 30
            });

            if (response?.data?.words) {
                setAllWords(prev => [...prev, ...response.data.words]);
                setCurrentIndex(prev => prev + 30);
            }
        } catch (error) {
            console.error("Error fetching words:", error);
        } finally {
            setIsLoading(false);
        }
    }, [mediaId, words, currentIndex, lang]);

    // Prepare game
    const prepareGame = useCallback(() => {
        if (allWords.length < 12) {
            fetchWords();
            return;
        }

        setIsLoading(true);

        // Select categories for this round
        const roundCategories = [...CATEGORIES].sort(() => Math.random() - 0.5).slice(0, 3);

        // Categorize words based on their meaning
        const categorizedWords: GameWord[] = [];
        const usedIds = new Set();

        roundCategories.forEach(category => {
            // Find words that might belong to this category
            const categoryWords = allWords
                .filter(word => {
                    const wordMeaning = word.translations?.[0]?.meaning?.toLowerCase() || '';
                    const wordText = word.word.toLowerCase();

                    // Check if word or its meaning contains any category keywords
                    return !usedIds.has(word.id) && (
                        category.keywords.some(keyword =>
                            wordMeaning.includes(keyword) || wordText.includes(keyword)
                        )
                    );
                })
                .slice(0, 4); // Take up to 4 words per category

            // Add them to the game words
            categoryWords.forEach(word => {
                usedIds.add(word.id);
                categorizedWords.push({
                    id: word.id,
                    word: word.word,
                    meaning: word.translations?.[0]?.meaning || 'No meaning available',
                    category: category.id,
                    allocated: false
                });
            });
        });

        // If we don't have enough words in some categories, add random words
        const additionalNeeded = 12 - categorizedWords.length;
        if (additionalNeeded > 0) {
            const randomWords = allWords
                .filter(word => !usedIds.has(word.id))
                .slice(0, additionalNeeded)
                .map(word => {
                    const randomCategory = roundCategories[Math.floor(Math.random() * roundCategories.length)];
                    return {
                        id: word.id,
                        word: word.word,
                        meaning: word.translations?.[0]?.meaning || 'No meaning available',
                        category: randomCategory.id,
                        allocated: false
                    };
                });

            categorizedWords.push(...randomWords);
        }

        // Set up category scores
        setCategoryScores(
            roundCategories.map(category => ({
                id: category.id,
                name: category.name,
                total: categorizedWords.filter(word => word.category === category.id).length,
                correct: 0
            }))
        );

        // Shuffle and set the game words
        setGameWords(categorizedWords.sort(() => Math.random() - 0.5));
        setCurrentCategory(null);
        setFeedback(null);

        setIsLoading(false);
    }, [allWords, fetchWords]);

    // Initialize game
    useEffect(() => {
        if (allWords.length === 0) {
            fetchWords();
        }
    }, [allWords.length, fetchWords]);

    // Set up new round when needed
    useEffect(() => {
        if (!isLoading && allWords.length > 0 && gameWords.length === 0) {
            prepareGame();
        }
    }, [isLoading, allWords, gameWords.length, prepareGame]);

    // Check if round is complete
    useEffect(() => {
        if (gameWords.length > 0 && gameWords.every(word => word.allocated)) {
            // Check if all rounds completed
            if (round >= 3) {
                setTimeout(() => {
                    setGameCompleted(true);
                }, 1500);
            } else {
                setTimeout(() => {
                    setRound(prev => prev + 1);
                    // Remove used words
                    setAllWords(prev => prev.filter(word =>
                        !gameWords.some(gameWord => gameWord.id === word.id)
                    ));
                    setGameWords([]);
                }, 1500);
            }
        }
    }, [gameWords, round]);

    // Handle category selection
    const selectCategory = (categoryId: string) => {
        if (feedback) return; // Don't allow selection during feedback
        setCurrentCategory(prev => prev === categoryId ? null : categoryId);
    };

    // Handle word categorization
    const categorizeWord = async (word: GameWord) => {
        if (!currentCategory || feedback || word.allocated) return;

        const isCorrect = word.category === currentCategory;

        // Update score
        if (isCorrect) {
            setScore(prev => prev + 10);

            // Update category score
            setCategoryScores(prev =>
                prev.map(cat =>
                    cat.id === currentCategory
                        ? { ...cat, correct: cat.correct + 1 }
                        : cat
                )
            );

            // Record success with API
            try {
                await memoryGameAction({
                    wordId: word.id,
                    hard: false,
                    mediaId
                });
            } catch (error) {
                console.error("Error recording success:", error);
            }
        } else {
            // Record failure with API
            try {
                await memoryGameAction({
                    wordId: word.id,
                    hard: true,
                    mediaId
                });
            } catch (error) {
                console.error("Error recording failure:", error);
            }
        }

        // Show feedback
        setFeedback({ wordId: word.id, isCorrect });

        // Mark word as allocated
        setGameWords(prev =>
            prev.map(w =>
                w.id === word.id
                    ? { ...w, allocated: true }
                    : w
            )
        );

        // Clear feedback and category after a delay
        setTimeout(() => {
            setFeedback(null);
        }, 1000);
    };

    // Loading state
    if (isLoading && (allWords.length === 0 || gameWords.length === 0)) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <LoaderSpinner size="large" />
                    <p className="mt-4 text-zinc-300 dark:text-zinc-400">
                        Loading word categories game...
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
                        You've mastered word categorization!
                    </p>

                    <div className="flex justify-center">
                        <motion.button
                            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-medium rounded-lg shadow-lg"
                            onClick={() => {
                                setGameCompleted(false);
                                setScore(0);
                                setRound(1);
                                prepareGame();
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
                        <span className="text-emerald-400 font-medium">Round {round}/3</span>
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
                    <h2 className="text-white text-xl font-medium">Sort words into the correct categories</h2>
                    <p className="text-zinc-400 text-sm mt-1">Select a category, then click on words that belong to it</p>
                </motion.div>
            </div>

            {/* Game container */}
            <div className="w-full max-w-4xl">
                {/* Categories */}
                <motion.div
                    className="grid grid-cols-3 gap-4 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    {categoryScores.map((category, idx) => (
                        <motion.button
                            key={category.id}
                            className={clsx(
                                "py-4 px-3 rounded-lg backdrop-blur-sm text-white font-medium border-2 transition-all flex flex-col items-center",
                                currentCategory === category.id
                                    ? "bg-indigo-600/60 border-indigo-400/80 shadow-lg"
                                    : "bg-gray-800/40 border-gray-700/50 hover:bg-gray-700/60"
                            )}
                            onClick={() => selectCategory(category.id)}
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.97 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                transition: { delay: idx * 0.1 }
                            }}
                        >
                            <span className="text-lg mb-2">{category.name}</span>
                            <div className="flex items-center text-sm">
                                <span className={category.correct === category.total ? "text-emerald-400" : "text-zinc-400"}>
                                    {category.correct}/{category.total}
                                </span>
                            </div>
                        </motion.button>
                    ))}
                </motion.div>

                {/* Words */}
                <motion.div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    {gameWords.map((word, idx) => (
                        <motion.div
                            key={word.id}
                            className={clsx(
                                "relative py-3 px-4 rounded-lg backdrop-blur-sm border-2 transition-all overflow-hidden",
                                word.allocated
                                    ? "cursor-default"
                                    : currentCategory
                                        ? "cursor-pointer hover:bg-gray-700/60"
                                        : "cursor-not-allowed",
                                word.allocated
                                    ? feedback?.wordId === word.id
                                        ? feedback.isCorrect
                                            ? "bg-emerald-500/60 border-emerald-400/80"
                                            : "bg-rose-500/60 border-rose-400/80"
                                        : "bg-gray-700/30 border-gray-600/50 opacity-60"
                                    : "bg-gray-800/40 border-gray-700/50"
                            )}
                            onClick={() => !word.allocated && categorizeWord(word)}
                            whileHover={!word.allocated ? { y: -2, scale: 1.02 } : {}}
                            whileTap={!word.allocated ? { scale: 0.98 } : {}}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{
                                opacity: word.allocated && !feedback?.wordId ? 0.7 : 1,
                                scale: 1,
                                transition: { delay: idx * 0.05 }
                            }}
                        >
                            <div className="mb-2">
                                <h3 className="font-bold text-white">{word.word}</h3>
                            </div>
                            <p className="text-sm text-zinc-300 line-clamp-2">
                                {word.meaning}
                            </p>

                            {/* Indicator for allocated words */}
                            {word.allocated && feedback?.wordId === word.id && (
                                <motion.div
                                    className="absolute inset-0 flex items-center justify-center bg-black/30"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {feedback.isCorrect ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    )}
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};
