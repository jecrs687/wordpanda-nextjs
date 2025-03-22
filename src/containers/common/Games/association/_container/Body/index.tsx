'use client';

import { Progress } from '@/components/ui/progress';
import { memoryGameAction } from '@backend/domain/actions/Games/memory.action';
import { getWords } from '@backend/domain/actions/Word/getWords.action';
import { ROUTES } from '@constants/ROUTES';
import Button from '@core/Button';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, BrainCircuit, Loader2, Network, RefreshCw, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { WordWithTranslationsAndUserWords } from 'src/app/api/words/route';

// Word associations: words that are commonly related to each other
const WORD_ASSOCIATIONS: Record<string, Record<string, string[]>> = {
    'en': {
        'hot': ['cold', 'warm', 'fire', 'sun', 'summer'],
        'day': ['night', 'morning', 'sun', 'light', 'time'],
        'water': ['drink', 'sea', 'ocean', 'river', 'liquid'],
        'food': ['eat', 'hungry', 'meal', 'restaurant', 'kitchen'],
        'happy': ['sad', 'joy', 'smile', 'laugh', 'emotion'],
        'big': ['small', 'large', 'huge', 'size', 'giant'],
        'fast': ['slow', 'quick', 'speed', 'race', 'car'],
        'good': ['bad', 'nice', 'excellent', 'quality', 'positive'],
        'old': ['new', 'young', 'ancient', 'age', 'elderly'],
        'work': ['job', 'office', 'business', 'career', 'money'],
        'house': ['home', 'building', 'family', 'roof', 'room'],
        'book': ['read', 'write', 'page', 'library', 'story'],
        'car': ['drive', 'road', 'vehicle', 'travel', 'wheel'],
        'time': ['clock', 'hour', 'minute', 'day', 'year'],
        'money': ['bank', 'rich', 'wealth', 'cash', 'coin']
    },
    'es': {
        'caliente': ['frío', 'calor', 'fuego', 'sol', 'verano'],
        'día': ['noche', 'mañana', 'sol', 'luz', 'tiempo'],
        'agua': ['beber', 'mar', 'océano', 'río', 'líquido'],
        'comida': ['comer', 'hambre', 'plato', 'restaurante', 'cocina'],
        'feliz': ['triste', 'alegría', 'sonrisa', 'reír', 'emoción'],
        'grande': ['pequeño', 'enorme', 'tamaño', 'gigante', 'amplio'],
        'rápido': ['lento', 'veloz', 'velocidad', 'carrera', 'coche'],
        'bueno': ['malo', 'agradable', 'excelente', 'calidad', 'positivo']
    },
    'fr': {
        'chaud': ['froid', 'chaleur', 'feu', 'soleil', 'été'],
        'jour': ['nuit', 'matin', 'soleil', 'lumière', 'temps'],
        'eau': ['boire', 'mer', 'océan', 'rivière', 'liquide'],
        'nourriture': ['manger', 'faim', 'repas', 'restaurant', 'cuisine'],
        'heureux': ['triste', 'joie', 'sourire', 'rire', 'émotion']
    }
};

interface WordCard {
    id: string;
    word: string;
    isFlipped: boolean;
    isMatched: boolean;
    pairId: number;
}

export const Body = ({ words, lang, mediaId }: { words: { word: string }[], lang: string, mediaId?: string }) => {
    const { theme } = useTheme();
    const [allWords, setAllWords] = useState<WordWithTranslationsAndUserWords[]>([]);
    const [wordCards, setWordCards] = useState<WordCard[]>([]);
    const [flippedCards, setFlippedCards] = useState<string[]>([]);
    const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
    const [score, setScore] = useState(0);
    const [moves, setMoves] = useState(0);
    const [level, setLevel] = useState(1);
    const [isGameCompleted, setIsGameCompleted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    // Set up the game when words are loaded
    useEffect(() => {
        if (allWords.length > 0) {
            setupCards(level);
        }
    }, [allWords, level]);

    const setupCards = (currentLevel: number) => {
        // Number of pairs increases with level
        const numPairs = Math.min(6 + currentLevel, 10);

        // Generate card pairs for the game
        const cardPairs: WordCard[] = [];
        const usedWordIds = new Set<string>();
        const langAssociations = WORD_ASSOCIATIONS[lang as keyof typeof WORD_ASSOCIATIONS] || WORD_ASSOCIATIONS['en'];

        const filteredWords = allWords.filter(word =>
            langAssociations[word.word.toLowerCase()] !== undefined
        );

        // If we don't have enough words with associations, use random words
        const wordsToUse = filteredWords.length >= numPairs ? filteredWords : allWords;

        for (let i = 0; i < numPairs && i < wordsToUse.length; i++) {
            let baseWord: WordWithTranslationsAndUserWords | undefined;

            // Find a word we haven't used yet
            do {
                const randomIndex = Math.floor(Math.random() * wordsToUse.length);
                baseWord = wordsToUse[randomIndex];
            } while (baseWord && usedWordIds.has(baseWord.id));

            if (!baseWord) break;
            usedWordIds.add(baseWord.id);

            // Create first card with the base word
            cardPairs.push({
                id: `card-${i}-a-${baseWord.id}`,
                word: baseWord.word,
                isFlipped: false,
                isMatched: false,
                pairId: i
            });

            // Find or create a related word for the matching card
            const relatedWords = langAssociations[baseWord.word.toLowerCase()];
            if (relatedWords && relatedWords.length > 0) {
                // Use a related word from our predefined associations
                const randomRelatedWord = relatedWords[Math.floor(Math.random() * relatedWords.length)];
                cardPairs.push({
                    id: `card-${i}-b-${baseWord.id}`,
                    word: randomRelatedWord,
                    isFlipped: false,
                    isMatched: false,
                    pairId: i
                });
            } else {
                // If no associations exist, use a word's translation if available
                if (baseWord.translations && baseWord.translations.length > 0) {
                    const translation = baseWord.translations[0].translations;
                    cardPairs.push({
                        id: `card-${i}-b-${baseWord.id}`,
                        word: translation[0]?.word || `${baseWord.word}*`,
                        isFlipped: false,
                        isMatched: false,
                        pairId: i
                    });
                } else {
                    // Fallback: create a simple variation
                    cardPairs.push({
                        id: `card-${i}-b-${baseWord.id}`,
                        word: `${baseWord.word}*`,
                        isFlipped: false,
                        isMatched: false,
                        pairId: i
                    });
                }
            }
        }

        // Shuffle the cards
        const shuffledCards = [...cardPairs].sort(() => Math.random() - 0.5);
        setWordCards(shuffledCards);
        setFlippedCards([]);
        setMatchedPairs([]);
        setMoves(0);
    };

    const handleCardClick = (cardId: string) => {
        // Ignore click if card is already flipped or matched
        const card = wordCards.find(card => card.id === cardId);
        if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

        // Flip the card
        setWordCards(prevCards =>
            prevCards.map(c => c.id === cardId ? { ...c, isFlipped: true } : c)
        );

        // Add to flipped cards
        const newFlippedCards = [...flippedCards, cardId];
        setFlippedCards(newFlippedCards);

        // If we have 2 flipped cards, check for a match
        if (newFlippedCards.length === 2) {
            setMoves(prev => prev + 1);

            const [firstCardId, secondCardId] = newFlippedCards;
            const firstCard = wordCards.find(card => card.id === firstCardId);
            const secondCard = wordCards.find(card => card.id === secondCardId);

            if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
                // It's a match!
                setMatchedPairs(prev => [...prev, firstCard.pairId]);
                setScore(prev => prev + 10);

                // Record successful pairing in memory
                const originalWord = allWords.find(w => firstCard.word.toLowerCase() === w.word.toLowerCase());
                if (originalWord) {
                    memoryGameAction({
                        wordId: originalWord.id,
                        hard: false,
                        mediaId
                    });
                }

                // Clear flipped cards for next turn
                setTimeout(() => {
                    setFlippedCards([]);

                    // Check if game is complete
                    if (matchedPairs.length + 1 === wordCards.length / 2) {
                        if (level < 3) {
                            // Move to next level
                            setLevel(prev => prev + 1);
                        } else {
                            // Game completed
                            setIsGameCompleted(true);
                        }
                    }
                }, 1000);
            } else {
                // Not a match, flip cards back after a delay
                setTimeout(() => {
                    setWordCards(prevCards =>
                        prevCards.map(c =>
                            newFlippedCards.includes(c.id) ? { ...c, isFlipped: false } : c
                        )
                    );
                    setFlippedCards([]);

                    // Record failed pairing in memory
                    if (firstCard) {
                        const originalWord = allWords.find(w => firstCard.word.toLowerCase() === w.word.toLowerCase());
                        if (originalWord) {
                            memoryGameAction({
                                wordId: originalWord.id,
                                hard: true,
                                mediaId
                            });
                        }
                    }
                }, 1500);
            }
        }
    };

    const restartGame = () => {
        setLevel(1);
        setScore(0);
        setMoves(0);
        setIsGameCompleted(false);
        setupCards(1);
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
                    <p className="text-zinc-600 dark:text-zinc-300 text-lg">Loading word associations...</p>
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
                                Word Association Completed!
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-300">
                                You matched all word pairs with {moves} moves.
                            </p>
                            <div className="mt-4 p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30">
                                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                    {score}
                                </p>
                                <p className="text-sm text-emerald-700 dark:text-emerald-300">Points</p>
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

    const progressPercentage = (matchedPairs.length / (wordCards.length / 2)) * 100;

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-zinc-200/30 dark:border-zinc-800/30">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-800 dark:text-white">
                            Word Association
                        </h2>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Match words that are related to each other
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 dark:bg-gray-900/40 backdrop-blur-sm px-4 py-2 rounded-full">
                            <span className="text-indigo-600 dark:text-indigo-400 font-medium">Level {level}/3</span>
                        </div>
                        <div className="bg-white/20 dark:bg-gray-900/40 backdrop-blur-sm px-4 py-2 rounded-full">
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">{score}</span>
                            <span className="text-zinc-500 ml-1">pts</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                        <span>Progress</span>
                        <span>{matchedPairs.length} of {wordCards.length / 2} pairs</span>
                    </div>
                    <Progress value={progressPercentage} />
                </div>

                <div className="mt-2 flex justify-between">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">Moves: {moves}</span>
                    <Button
                        onClick={() => setupCards(level)}
                        variant="ghost"
                        className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                    >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Reset
                    </Button>
                </div>
            </div>

            {/* Game Content */}
            <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`level-${level}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-4xl mx-auto"
                    >
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                            {wordCards.map((card) => (
                                <motion.div
                                    key={card.id}
                                    whileHover={!card.isFlipped && !card.isMatched ? { scale: 1.03 } : {}}
                                    whileTap={!card.isFlipped && !card.isMatched ? { scale: 0.97 } : {}}
                                    initial={{ rotateY: 0 }}
                                    animate={{
                                        rotateY: card.isFlipped ? 180 : 0,
                                        scale: card.isMatched ? 0.95 : 1
                                    }}
                                    transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
                                    className={`aspect-[3/4] cursor-pointer perspective-500 transform-style-3d ${card.isMatched ? 'opacity-70' : 'opacity-100'
                                        }`}
                                    onClick={() => !card.isFlipped && !card.isMatched && handleCardClick(card.id)}
                                >
                                    <div className={`absolute inset-0 backface-hidden rounded-xl ${theme === 'dark'
                                        ? 'bg-gradient-to-br from-indigo-900/80 to-violet-900/80'
                                        : 'bg-gradient-to-br from-indigo-500/80 to-violet-500/70'
                                        } shadow-lg border border-white/10 flex items-center justify-center`}>
                                        <BrainCircuit className="h-8 w-8 text-white/70" />
                                    </div>

                                    <div className={`absolute inset-0 backface-hidden rounded-xl ${card.isMatched
                                        ? theme === 'dark'
                                            ? 'bg-gradient-to-br from-emerald-900/80 to-emerald-800/80'
                                            : 'bg-gradient-to-br from-emerald-500/80 to-emerald-400/70'
                                        : theme === 'dark'
                                            ? 'bg-gradient-to-br from-gray-800/90 to-slate-800/90'
                                            : 'bg-white/90'
                                        } shadow-lg border ${card.isMatched
                                            ? 'border-emerald-500/30'
                                            : 'border-zinc-200/50 dark:border-zinc-700/50'
                                        } flex items-center justify-center rotateY-180`}>
                                        <div className="text-center px-2">
                                            <p className={`font-medium text-lg ${card.isMatched
                                                ? 'text-white'
                                                : 'text-zinc-800 dark:text-white'
                                                }`}>
                                                {card.word}
                                            </p>

                                            {card.isMatched && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="flex justify-center mt-2"
                                                >
                                                    <Sparkles className="h-4 w-4 text-white/70" />
                                                </motion.div>
                                            )}
                                        </div>

                                        {matchedPairs.includes(card.pairId) && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 0.9 }}
                                                transition={{ delay: 0.3, duration: 0.5 }}
                                                className="absolute top-2 right-2"
                                            >
                                                <Network className="h-4 w-4 text-white" />
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
