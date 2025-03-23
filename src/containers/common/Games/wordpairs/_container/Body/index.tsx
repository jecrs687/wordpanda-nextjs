'use client';

import { memoryGameAction } from '@backend/domain/actions/Games/memory.action';
import { getWords } from '@backend/domain/actions/Word/getWords.action';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { Award, Brain, Clock, Play, RotateCcw, Zap } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { WordWithTranslationsAndUserWords } from 'src/app/api/words/route';
import Badge from '../../../_components/Badge';
import ConfettiEffect from '../../../_components/ConfettiEffect';
import GameButton from '../../../_components/GameButton';
import ProgressBar from '../../../_components/ProgressBar';
import { LoadingGames } from '../../../_container/Loading';
import MemoryCard from '../../_components/MemoryCard';

type PairItem = {
    id: string;
    word: string;
    meaning: string;
    pairId: string;
    isFlipped: boolean;
    isMatched: boolean;
};

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 300, damping: 25 }
    }
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
    const [gameCards, setGameCards] = useState<PairItem[]>([]);
    const [flippedCards, setFlippedCards] = useState<string[]>([]);
    const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [score, setScore] = useState(0);
    const [moves, setMoves] = useState(0);
    const [level, setLevel] = useState(1);
    const [cardsPerLevel, setCardsPerLevel] = useState(8); // Must be even
    const [isChecking, setIsChecking] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [gameTime, setGameTime] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [streak, setStreak] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);

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
                const filteredWords = response.data.words.filter(word =>
                    word.translations &&
                    word.translations.length > 0 &&
                    word.translations[0].meaning
                );

                setAllWords(prev => [...prev, ...filteredWords]);
                setCurrentIndex(prev => prev + 30);
            }
        } catch (error) {
            console.error("Error fetching words:", error);
        } finally {
            setIsLoading(false);
        }
    }, [mediaId, words, currentIndex, lang]);

    // Prepare game level
    const prepareLevel = useCallback(() => {
        if (allWords.length < cardsPerLevel / 2) {
            fetchWords();
            return;
        }

        setIsLoading(true);
        setGameStarted(true);

        // Select words for this level
        const pairCount = cardsPerLevel / 2;
        const selectedWords = allWords.slice(0, pairCount);

        // Create pairs (word + meaning)
        const pairs: PairItem[] = [];

        selectedWords.forEach(word => {
            // Add word card
            pairs.push({
                id: `word-${word.id}`,
                word: word.word,
                meaning: '',
                pairId: word.id,
                isFlipped: false,
                isMatched: false
            });

            // Add meaning card
            pairs.push({
                id: `meaning-${word.id}`,
                word: '',
                meaning: word.translations?.[0]?.meaning || 'No meaning',
                pairId: word.id,
                isFlipped: false,
                isMatched: false
            });
        });

        // Shuffle pairs
        const shuffledPairs = [...pairs].sort(() => Math.random() - 0.5);

        setGameCards(shuffledPairs);
        setFlippedCards([]);
        setMatchedPairs([]);
        setMoves(0);
        setStreak(0);

        // Remove used words
        setAllWords(prev => prev.slice(pairCount));

        setIsLoading(false);
    }, [allWords, cardsPerLevel, fetchWords]);

    // Game timer
    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (gameStarted && !gameCompleted) {
            timer = setInterval(() => {
                setGameTime(prev => prev + 1);
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [gameStarted, gameCompleted]);

    // Initialize game
    useEffect(() => {
        if (allWords.length === 0) {
            fetchWords();
        }
    }, [allWords.length, fetchWords]);

    // Set up level
    useEffect(() => {
        if (!isLoading && allWords.length >= cardsPerLevel / 2 && gameCards.length === 0) {
            prepareLevel();
        }
    }, [isLoading, allWords.length, cardsPerLevel, gameCards.length, prepareLevel]);

    // Check for completed level
    useEffect(() => {
        if (matchedPairs.length === cardsPerLevel / 2 && gameCards.length > 0) {
            // Level completed
            setTimeout(() => {
                if (level >= 3) {
                    setGameCompleted(true);
                    setGameStarted(false);
                } else {
                    setLevel(prev => prev + 1);
                    setCardsPerLevel(prev => Math.min(prev + 4, 16)); // Increase difficulty
                    prepareLevel();
                }
            }, 1000);
        }
    }, [matchedPairs.length, cardsPerLevel, gameCards.length, level, prepareLevel]);

    // Handle card flip
    const handleCardClick = async (cardId: string, pairId: string) => {
        // Don't allow clicks during checking or if card is already flipped/matched
        if (
            isChecking ||
            flippedCards.includes(cardId) ||
            matchedPairs.includes(pairId) ||
            flippedCards.length >= 2
        ) {
            return;
        }

        // Flip the card
        const newFlippedCards = [...flippedCards, cardId];
        setFlippedCards(newFlippedCards);

        // Update the game cards
        setGameCards(prev =>
            prev.map(card =>
                card.id === cardId
                    ? { ...card, isFlipped: true }
                    : card
            )
        );

        // Check for match if two cards are flipped
        if (newFlippedCards.length === 2) {
            setIsChecking(true);
            setMoves(prev => prev + 1);

            // Get the two flipped cards
            const [firstCardId, secondCardId] = newFlippedCards;
            const firstCard = gameCards.find(card => card.id === firstCardId);
            const secondCard = gameCards.find(card => card.id === secondCardId);

            if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
                // Match found!
                setScore(prev => prev + (10 * level));
                setMatchedPairs(prev => [...prev, firstCard.pairId]);
                setStreak(prev => prev + 1);

                // Show confetti for matches
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 1000);

                // Update the game cards
                setGameCards(prev =>
                    prev.map(card =>
                        card.pairId === firstCard.pairId
                            ? { ...card, isMatched: true }
                            : card
                    )
                );

                // Record success with API for both card types
                try {
                    await memoryGameAction({
                        wordId: firstCard.pairId,
                        hard: false,
                        mediaId
                    });
                } catch (error) {
                    console.error("Error recording success:", error);
                }

                // Reset for next selection
                setFlippedCards([]);
                setIsChecking(false);
            } else {
                // No match - flip cards back after delay
                setTimeout(async () => {
                    setGameCards(prev =>
                        prev.map(card =>
                            flippedCards.includes(card.id)
                                ? { ...card, isFlipped: false }
                                : card
                        )
                    );
                    setFlippedCards([]);
                    setIsChecking(false);
                    setStreak(0);

                    // Record failure for first card's word
                    if (firstCard) {
                        try {
                            await memoryGameAction({
                                wordId: firstCard.pairId,
                                hard: true,
                                mediaId
                            });
                        } catch (error) {
                            console.error("Error recording failure:", error);
                        }
                    }
                }, 1000);
            }
        }
    };

    const restartGame = () => {
        setScore(0);
        setLevel(1);
        setCardsPerLevel(8);
        setGameCompleted(false);
        setGameTime(0);
        setStreak(0);
        prepareLevel();
    };

    // Format time as mm:ss
    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Start game view when not yet started
    if (!gameStarted && !isLoading && gameCards.length === 0 && !gameCompleted) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-4 md:p-8">
                <motion.div
                    className="max-w-md w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center mb-6">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                                <Brain className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Word Pairs Memory Game</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            Test your memory by matching words with their definitions. Complete levels to increase difficulty!
                        </p>
                    </div>

                    <div className="bg-gray-100/80 dark:bg-gray-800/80 rounded-xl p-4 mb-6">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">How to Play:</h3>
                        <ul className="text-gray-600 dark:text-gray-300 space-y-1 text-sm">
                            <li>• Flip cards to reveal words and their meanings</li>
                            <li>• Match pairs correctly to earn points</li>
                            <li>• Complete each level to advance</li>
                            <li>• Earn bonus points with consecutive matches</li>
                            <li>• Complete all 3 levels to finish the game</li>
                        </ul>
                    </div>

                    <GameButton
                        onClick={restartGame}
                        variant="primary"
                        size="lg"
                        fullWidth
                        icon={<Play className="h-5 w-5" />}
                    >
                        Start Game
                    </GameButton>
                </motion.div>
            </div>
        );
    }

    // Loading state
    if (isLoading && gameCards.length === 0) {
        return <LoadingGames />;
    }

    // Game completed screen
    if (gameCompleted) {
        return (
            <div className="h-full w-full flex items-center justify-center p-6">
                <motion.div
                    className="max-w-lg w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-8 shadow-xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex justify-center mb-6">
                        <motion.div className="relative">
                            <Award className="h-16 w-16 text-amber-500 dark:text-amber-400" />
                            <motion.span
                                className="absolute inset-0 rounded-full bg-amber-400/20"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </motion.div>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-6">Game Completed!</h2>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-gray-100/80 dark:bg-gray-800/80 rounded-xl p-4 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Final Score</p>
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{score}</p>
                        </div>

                        <div className="bg-gray-100/80 dark:bg-gray-800/80 rounded-xl p-4 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Moves Used</p>
                            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{moves}</p>
                        </div>

                        <div className="bg-gray-100/80 dark:bg-gray-800/80 rounded-xl p-4 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Time Taken</p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatTime(gameTime)}</p>
                        </div>

                        <div className="bg-gray-100/80 dark:bg-gray-800/80 rounded-xl p-4 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Efficiency</p>
                            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                {moves > 0 ? Math.round((score / moves) * 10) / 10 : 0}
                            </p>
                        </div>
                    </div>

                    <GameButton
                        onClick={restartGame}
                        variant="primary"
                        size="lg"
                        fullWidth
                        icon={<Play className="h-5 w-5" />}
                    >
                        Play Again
                    </GameButton>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="relative h-full w-full flex flex-col items-center justify-center p-4 sm:p-6">
            {/* Confetti effect for correct matches */}
            <ConfettiEffect active={showConfetti} pieces={30} />

            {/* Game header */}
            <div className="w-full max-w-4xl mb-4 sm:mb-6">
                <div className="flex flex-wrap justify-between items-center gap-3">
                    <motion.div
                        className="flex flex-wrap items-center gap-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Badge variant="success" size="md">Score: {score}</Badge>
                        <Badge variant="primary" size="md">Level: {level}</Badge>

                        {streak > 1 && (
                            <Badge
                                variant="warning"
                                size="md"
                                icon={<Zap className="h-4 w-4" />}
                                pulse
                            >
                                Streak: {streak}x
                            </Badge>
                        )}
                    </motion.div>

                    <motion.div
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-3 py-1.5 border border-gray-200/50 dark:border-gray-700/50"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="text-gray-700 dark:text-gray-300 font-medium flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1.5 text-blue-500 dark:text-blue-400" />
                            Time: {formatTime(gameTime)}
                        </span>
                    </motion.div>
                </div>

                <motion.div
                    className="mt-3 text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="text-gray-900 dark:text-white text-lg font-medium">Match words with their meanings</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Find all {cardsPerLevel / 2} pairs to advance to the next level
                    </p>
                </motion.div>

                {/* Progress bar */}
                <div className="mt-3">
                    <ProgressBar
                        value={matchedPairs.length}
                        max={cardsPerLevel / 2}
                        height="md"
                        showPercentage
                    />
                </div>
            </div>

            {/* Game grid */}
            <motion.div
                className={clsx(
                    "w-full max-w-4xl grid gap-2 sm:gap-3",
                    cardsPerLevel === 8 ? "grid-cols-2 sm:grid-cols-4" :
                        cardsPerLevel === 12 ? "grid-cols-3 sm:grid-cols-4" :
                            "grid-cols-3 sm:grid-cols-4"
                )}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {gameCards.map((card) => (
                    <motion.div
                        key={card.id}
                        className={clsx(
                            "aspect-[3/4] rounded-xl cursor-pointer perspective-500",
                            card.isMatched ? "pointer-events-none" : ""
                        )}
                        onClick={() => handleCardClick(card.id, card.pairId)}
                        variants={cardVariants}
                    >
                        <MemoryCard
                            key={card.id}
                            isFlipped={card.isFlipped}
                            isMatched={card.isMatched}
                            text={card.word || card.meaning}
                            language={card.word ? 'word' : 'meaning'}
                        />
                    </motion.div>
                ))}
            </motion.div>

            {/* Restart button */}
            <motion.div
                className="mt-6 flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <GameButton
                    onClick={restartGame}
                    variant="outline"
                    size="md"
                    icon={<RotateCcw className="h-4 w-4 mr-1" />}
                >
                    Restart Game
                </GameButton>
            </motion.div>

            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-400/5 dark:bg-emerald-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-40 right-10 w-96 h-96 bg-indigo-400/5 dark:bg-indigo-400/10 rounded-full blur-3xl" />
            </div>

            {/* Loading overlay */}
            {isLoading && (
                <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="flex flex-col items-center">
                        <LoadingGames />
                    </div>
                </div>
            )}
        </div>
    );
};
