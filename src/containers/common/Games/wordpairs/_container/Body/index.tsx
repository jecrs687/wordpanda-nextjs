'use client';
import { memoryGameAction } from '@backend/domain/actions/Games/memory.action';
import { getWords } from '@backend/domain/actions/Word/getWords.action';
import LoaderSpinner from '@core/LoaderSpinner';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { WordWithTranslationsAndUserWords } from 'src/app/api/words/route';

type PairItem = {
    id: string;
    word: string;
    meaning: string;
    pairId: string;
    isFlipped: boolean;
    isMatched: boolean;
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

        // Remove used words
        setAllWords(prev => prev.slice(pairCount));

        setIsLoading(false);
    }, [allWords, cardsPerLevel, fetchWords]);

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
        prepareLevel();
    };

    // Loading state
    if (isLoading && gameCards.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <LoaderSpinner size="large" />
                    <p className="mt-4 text-zinc-300 dark:text-zinc-400">
                        Loading word pairs game...
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
                        You've completed all word pair challenges in {moves} moves!
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
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="bg-gray-800/70 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="text-emerald-400 font-medium">Level {level}/3</span>
                        </div>

                        <div className="bg-gray-800/70 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="text-white font-medium">Moves: <span className="text-amber-400">{moves}</span></span>
                        </div>
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
                    <h2 className="text-white text-xl font-medium">Match words with their meanings</h2>
                    <p className="text-zinc-400 text-sm mt-1">Find all {cardsPerLevel / 2} pairs to advance to the next level</p>
                </motion.div>
            </div>

            {/* Game grid */}
            <motion.div
                className={clsx(
                    "w-full max-w-4xl grid gap-3",
                    cardsPerLevel === 8 ? "grid-cols-2 sm:grid-cols-4" :
                        cardsPerLevel === 12 ? "grid-cols-3 sm:grid-cols-4" :
                            "grid-cols-3 sm:grid-cols-4"
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                {gameCards.map((card, idx) => (
                    <motion.div
                        key={card.id}
                        className={clsx(
                            "aspect-[3/4] rounded-lg cursor-pointer backdrop-blur-sm shadow-lg transition-all perspective-500",
                            card.isMatched ? "pointer-events-none" : ""
                        )}
                        onClick={() => handleCardClick(card.id, card.pairId)}
                        initial={{ opacity: 0, rotateY: 180, scale: 0.8 }}
                        animate={{
                            opacity: 1,
                            rotateY: 0,
                            scale: 1,
                            transition: { delay: idx * 0.05, type: "spring", stiffness: 300, damping: 20 }
                        }}
                    >
                        <motion.div
                            className="relative w-full h-full transform-style-3d transition-all duration-500"
                            animate={{
                                rotateY: card.isFlipped || card.isMatched ? 180 : 0,
                            }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Card back */}
                            <div className="absolute inset-0 backface-hidden rounded-lg border-2 border-gray-700/50 bg-gray-800/60 flex items-center justify-center">
                                <div className="text-3xl font-bold text-indigo-400">?</div>
                            </div>

                            {/* Card front */}
                            <div
                                className={clsx(
                                    "absolute inset-0 rounded-lg border-2 p-3 flex flex-col items-center justify-center backface-hidden rotate-y-180 text-center",
                                    card.isMatched
                                        ? "bg-emerald-600/60 border-emerald-400/80"
                                        : card.word
                                            ? "bg-indigo-600/60 border-indigo-400/80"
                                            : "bg-cyan-600/60 border-cyan-400/80"
                                )}
                            >
                                {card.word ? (
                                    <div>
                                        <h3 className="text-white font-bold text-xl mb-1">{card.word}</h3>
                                        <p className="text-white/80 text-xs">Word</p>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-white font-medium text-sm mb-1">{card.meaning}</p>
                                        <p className="text-white/80 text-xs">Meaning</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};
