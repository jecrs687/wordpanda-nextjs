'use client';

import { Progress } from '@/components/ui/progress';
import { memoryGameAction } from '@backend/domain/actions/Games/memory.action';
import { getWords } from '@backend/domain/actions/Word/getWords.action';
import { ROUTES } from '@constants/ROUTES';
import Button from '@core/Button';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, Check, Loader2, RefreshCw, Star, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { WordWithTranslationsAndUserWords } from 'src/app/api/words/route';

// Common word categories by language
const CATEGORIES = {
    'en': [
        { name: 'Food', words: ['apple', 'bread', 'cheese', 'meat', 'vegetable', 'fruit', 'lunch', 'dinner', 'breakfast', 'snack', 'dessert', 'egg', 'milk', 'rice', 'pasta'] },
        { name: 'Animals', words: ['dog', 'cat', 'bird', 'fish', 'lion', 'tiger', 'elephant', 'monkey', 'bear', 'horse', 'cow', 'pig', 'sheep', 'goat', 'chicken'] },
        { name: 'Clothing', words: ['shirt', 'pants', 'dress', 'hat', 'shoes', 'socks', 'jacket', 'coat', 'sweater', 'suit', 'tie', 'belt', 'jeans', 'shorts', 'skirt'] },
        { name: 'Travel', words: ['trip', 'vacation', 'hotel', 'flight', 'beach', 'mountain', 'passport', 'ticket', 'luggage', 'tour', 'guide', 'map', 'journey', 'adventure', 'destination'] },
        { name: 'Jobs', words: ['teacher', 'doctor', 'engineer', 'lawyer', 'nurse', 'chef', 'artist', 'writer', 'musician', 'actor', 'police', 'firefighter', 'pilot', 'driver', 'scientist'] }
    ],
    'es': [
        { name: 'Comida', words: ['manzana', 'pan', 'queso', 'carne', 'vegetal', 'fruta', 'almuerzo', 'cena', 'desayuno', 'merienda', 'postre', 'huevo', 'leche', 'arroz', 'pasta'] },
        { name: 'Animales', words: ['perro', 'gato', 'pájaro', 'pez', 'león', 'tigre', 'elefante', 'mono', 'oso', 'caballo', 'vaca', 'cerdo', 'oveja', 'cabra', 'pollo'] },
        { name: 'Ropa', words: ['camisa', 'pantalón', 'vestido', 'sombrero', 'zapatos', 'calcetines', 'chaqueta', 'abrigo', 'suéter', 'traje', 'corbata', 'cinturón', 'vaqueros', 'pantalones cortos', 'falda'] }
    ],
    'fr': [
        { name: 'Nourriture', words: ['pomme', 'pain', 'fromage', 'viande', 'légume', 'fruit', 'déjeuner', 'dîner', 'petit-déjeuner', 'goûter', 'dessert', 'œuf', 'lait', 'riz', 'pâtes'] },
        { name: 'Animaux', words: ['chien', 'chat', 'oiseau', 'poisson', 'lion', 'tigre', 'éléphant', 'singe', 'ours', 'cheval', 'vache', 'cochon', 'mouton', 'chèvre', 'poulet'] },
        { name: 'Vêtements', words: ['chemise', 'pantalon', 'robe', 'chapeau', 'chaussures', 'chaussettes', 'veste', 'manteau', 'pull', 'costume', 'cravate', 'ceinture', 'jean', 'short', 'jupe'] }
    ],
    'de': [
        { name: 'Essen', words: ['Apfel', 'Brot', 'Käse', 'Fleisch', 'Gemüse', 'Obst', 'Mittagessen', 'Abendessen', 'Frühstück', 'Snack', 'Dessert', 'Ei', 'Milch', 'Reis', 'Nudeln'] },
        { name: 'Tiere', words: ['Hund', 'Katze', 'Vogel', 'Fisch', 'Löwe', 'Tiger', 'Elefant', 'Affe', 'Bär', 'Pferd', 'Kuh', 'Schwein', 'Schaf', 'Ziege', 'Huhn'] },
        { name: 'Kleidung', words: ['Hemd', 'Hose', 'Kleid', 'Hut', 'Schuhe', 'Socken', 'Jacke', 'Mantel', 'Pullover', 'Anzug', 'Krawatte', 'Gürtel', 'Jeans', 'Shorts', 'Rock'] }
    ]
};

// Fallback categories if language not supported
const DEFAULT_CATEGORIES = [
    { name: 'Category A', words: [] },
    { name: 'Category B', words: [] },
    { name: 'Category C', words: [] }
];

interface DraggableWord {
    id: string;
    word: string;
    categoryId: string | null;
    correct: boolean | null;
}

interface Category {
    id: string;
    name: string;
    words: string[];
}

export const Body = ({ words, lang, mediaId }: { words: { word: string }[], lang: string, mediaId?: string }) => {
    const { theme } = useTheme();
    const [allWords, setAllWords] = useState<WordWithTranslationsAndUserWords[]>([]);
    const [currentLevel, setCurrentLevel] = useState(0);
    const [draggableWords, setDraggableWords] = useState<DraggableWord[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [score, setScore] = useState(0);
    const [isGameCompleted, setIsGameCompleted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [draggedWord, setDraggedWord] = useState<string | null>(null);
    const [totalLevels, setTotalLevels] = useState(4);

    // Initialize game with words from the API
    const updateWords = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getWords({
                language: lang,
                mediaId,
                limit: 50
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

    // Set up the game levels when words are loaded
    useEffect(() => {
        if (allWords.length > 0) {
            setupLevel(currentLevel);
        }
    }, [allWords, currentLevel]);

    const setupLevel = (level: number) => {
        // Get categories for the current language or use default
        const langCategories = CATEGORIES[lang as keyof typeof CATEGORIES] || DEFAULT_CATEGORIES;
        const availableCategories = [...langCategories];

        // Select 3 random categories for this level
        const selectedCategories: Category[] = [];
        for (let i = 0; i < 3 && availableCategories.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableCategories.length);
            const category = availableCategories.splice(randomIndex, 1)[0];
            selectedCategories.push({
                id: `category-${i}-${Math.random().toString(36).substring(2, 8)}`,
                name: category.name,
                words: category.words
            });
        }

        // Find words in our database that match these categories
        const categorizedWords: DraggableWord[] = [];
        const maxWordsPerCategory = 2 + Math.min(level, 2); // Increase difficulty with level

        // For each category, find matching words
        selectedCategories.forEach(category => {
            const matchingWords = allWords.filter(word =>
                category.words.includes(word.word.toLowerCase())
            ).slice(0, maxWordsPerCategory);

            // Add these words to our draggable words array
            matchingWords.forEach(word => {
                categorizedWords.push({
                    id: `word-${word.id}-${Math.random().toString(36).substring(2, 8)}`,
                    word: word.word,
                    categoryId: null,
                    correct: null
                });
            });
        });

        // If we don't have enough words that match our categories, add some random ones
        const additionalWordsNeeded = Math.max(0, 8 - categorizedWords.length);
        if (additionalWordsNeeded > 0) {
            const remainingWords = allWords.filter(word =>
                !categorizedWords.some(cw => cw.word.toLowerCase() === word.word.toLowerCase())
            ).slice(0, additionalWordsNeeded);

            remainingWords.forEach(word => {
                categorizedWords.push({
                    id: `word-${word.id}-${Math.random().toString(36).substring(2, 8)}`,
                    word: word.word,
                    categoryId: null,
                    correct: null
                });
            });
        }

        // Shuffle the words
        const shuffled = [...categorizedWords].sort(() => Math.random() - 0.5);
        setDraggableWords(shuffled);
        setCategories(selectedCategories);
        setIsChecking(false);
    };

    const handleDragStart = (wordId: string) => {
        setDraggedWord(wordId);
    };

    const handleDragEnd = () => {
        setDraggedWord(null);
    };

    const handleDrop = (categoryId: string) => {
        if (!draggedWord) return;

        setDraggableWords(prev => prev.map(word =>
            word.id === draggedWord
                ? { ...word, categoryId, correct: null }
                : word
        ));
    };

    const handleWordClick = (wordId: string, categoryId: string | null) => {
        // If already assigned to this category, remove it
        if (categoryId === null) return;

        setDraggableWords(prev => prev.map(word =>
            word.id === wordId
                ? { ...word, categoryId: null, correct: null }
                : word
        ));
    };

    const checkAnswers = () => {
        setIsChecking(true);
        let correctCount = 0;

        // Check each word for correct categorization
        const checkedWords = draggableWords.map(word => {
            // Skip uncategorized words
            if (word.categoryId === null) {
                return { ...word, correct: null };
            }

            // Find assigned category
            const category = categories.find(c => c.id === word.categoryId);
            if (!category) return { ...word, correct: false };

            // Check if word belongs to this category
            const belongsToCategory = category.words.includes(word.word.toLowerCase());
            if (belongsToCategory) correctCount++;

            // Record the result for memory tracking
            const originalWord = allWords.find(w => word.word.toLowerCase() === w.word.toLowerCase());
            if (originalWord) {
                memoryGameAction({
                    wordId: originalWord.id,
                    hard: !belongsToCategory,
                    mediaId
                });
            }

            return { ...word, correct: belongsToCategory };
        });

        setDraggableWords(checkedWords);
        setScore(prev => prev + correctCount);

        // Move to next level after a delay
        setTimeout(() => {
            if (currentLevel < totalLevels - 1) {
                setCurrentLevel(prev => prev + 1);
            } else {
                setIsGameCompleted(true);
            }
        }, 2000);
    };

    const restartGame = () => {
        setCurrentLevel(0);
        setScore(0);
        setIsGameCompleted(false);
        setupLevel(0);
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
                    <p className="text-zinc-600 dark:text-zinc-300 text-lg">Loading word categories...</p>
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
                                Categories Challenge Completed!
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-300">
                                You earned {score} points by categorizing words correctly.
                            </p>
                            <div className="mt-4 p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30">
                                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                    <Star className="inline-block h-6 w-6 mr-1 mb-1" />
                                    {score}
                                </p>
                                <p className="text-sm text-emerald-700 dark:text-emerald-300">Total Score</p>
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

    const progressPercentage = (currentLevel / totalLevels) * 100;
    const uncategorizedWords = draggableWords.filter(word => word.categoryId === null);
    const categorizedWords = draggableWords.filter(word => word.categoryId !== null);

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-zinc-200/30 dark:border-zinc-800/30">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-800 dark:text-white">
                            Word Categories
                        </h2>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Group words into their correct categories
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 dark:bg-gray-900/40 backdrop-blur-sm px-4 py-2 rounded-full">
                        <Star className="h-4 w-4 text-amber-500" />
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">{score}</span>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                        <span>Level</span>
                        <span>{currentLevel + 1} of {totalLevels}</span>
                    </div>
                    <Progress value={progressPercentage} />
                </div>
            </div>

            {/* Game Content */}
            <div className="flex-1 flex flex-col p-6 md:p-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentLevel}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-4xl mx-auto"
                    >
                        {/* Categories */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            {categories.map(category => (
                                <motion.div
                                    key={category.id}
                                    initial={{ scale: 0.95 }}
                                    animate={{ scale: 1 }}
                                    className={`rounded-xl p-4 h-full min-h-[180px] backdrop-blur-sm ${theme === 'dark'
                                            ? 'bg-gray-800/40 border border-gray-700/50'
                                            : 'bg-white/70 border border-zinc-200/70'
                                        } flex flex-col`}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.currentTarget.classList.add(
                                            theme === 'dark' ? 'bg-indigo-900/20' : 'bg-indigo-100/50'
                                        );
                                    }}
                                    onDragLeave={(e) => {
                                        e.currentTarget.classList.remove(
                                            theme === 'dark' ? 'bg-indigo-900/20' : 'bg-indigo-100/50'
                                        );
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        e.currentTarget.classList.remove(
                                            theme === 'dark' ? 'bg-indigo-900/20' : 'bg-indigo-100/50'
                                        );
                                        handleDrop(category.id);
                                    }}
                                >
                                    <h3 className="text-center font-bold text-lg mb-3 text-indigo-600 dark:text-indigo-400">
                                        {category.name}
                                    </h3>

                                    <div className="flex-1 flex flex-wrap gap-2 justify-center content-start">
                                        {categorizedWords
                                            .filter(word => word.categoryId === category.id)
                                            .map(word => (
                                                <motion.div
                                                    key={word.id}
                                                    layout
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    whileHover={{ scale: 1.05 }}
                                                    className={`px-3 py-1.5 rounded-lg cursor-pointer text-sm relative
                                                        ${word.correct === true
                                                            ? 'bg-emerald-500 text-white'
                                                            : word.correct === false
                                                                ? 'bg-rose-500 text-white'
                                                                : 'bg-indigo-500/90 text-white hover:bg-indigo-600'
                                                        }
                                                    `}
                                                    onClick={() => !isChecking && handleWordClick(word.id, category.id)}
                                                >
                                                    {word.word}

                                                    {word.correct !== null && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center"
                                                        >
                                                            {word.correct ? (
                                                                <Check className="h-4 w-4 text-white bg-emerald-500 rounded-full" />
                                                            ) : (
                                                                <X className="h-4 w-4 text-white bg-rose-500 rounded-full" />
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Available Words */}
                        <div className="mb-6">
                            <div className="p-4 rounded-xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm">
                                <h3 className="text-center font-medium mb-3 text-zinc-700 dark:text-zinc-300">
                                    Drag words to their categories
                                </h3>

                                <div className="flex flex-wrap gap-2 justify-center">
                                    {uncategorizedWords.map(word => (
                                        <motion.div
                                            key={word.id}
                                            draggable={!isChecking}
                                            onDragStart={() => handleDragStart(word.id)}
                                            onDragEnd={handleDragEnd}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.2 }}
                                            className={`px-3 py-1.5 rounded-lg cursor-grab active:cursor-grabbing text-sm
                                                bg-white/80 dark:bg-gray-700/80 hover:shadow-md text-zinc-800 dark:text-zinc-200
                                                border border-zinc-200/50 dark:border-zinc-700/50
                                            `}
                                        >
                                            {word.word}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-center">
                            <Button
                                onClick={checkAnswers}
                                disabled={isChecking || uncategorizedWords.length === draggableWords.length}
                                className={`px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium 
                                transition-all ${isChecking || uncategorizedWords.length === draggableWords.length
                                        ? 'opacity-70 cursor-not-allowed'
                                        : 'hover:shadow-lg'
                                    }`}
                            >
                                Check Categories
                            </Button>

                            <Button
                                onClick={() => setupLevel(currentLevel)}
                                disabled={isChecking}
                                className="ml-3 px-4 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 
                                text-zinc-700 dark:text-zinc-300 font-medium transition-all"
                            >
                                <RefreshCw className="h-4 w-4" />
                                <span className="ml-2 hidden md:inline">Reset</span>
                            </Button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
