"use client";

import { getWords } from '@/src/backend/domain/actions/Word/getWords.action';
import { memoryGameAction } from '@backend/domain/actions/Games/memory.action';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Inter, Poppins } from 'next/font/google';
import { useEffect, useState } from 'react';
import GameControls from './components/GameControls';
import GameHeader from './components/GameHeader';
import GameOverModal from './components/GameOverModal';
import MemoryCard from './components/MemoryCard';
import ScorePanel from './components/ScorePanel';


// Font setup
const poppins = Poppins({
    weight: ['500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
});

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
});

interface MemoryGameProps {
    lang: string;
    mediaId?: string;
}

export default function MemoryGame({ lang, mediaId }: MemoryGameProps) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [words, setWords] = useState<any[]>([]);
    const [gameCards, setGameCards] = useState<any[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [matchedCards, setMatchedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [processingAction, setProcessingAction] = useState(false);
    const [score, setScore] = useState(0);
    const [gameTime, setGameTime] = useState(0);
    const [gameTimer, setGameTimer] = useState<NodeJS.Timeout | null>(null);

    // Advanced tracking for intelligent scoring
    const [lastActionTime, setLastActionTime] = useState<number>(0);
    const [attemptedMatches, setAttemptedMatches] = useState<Map<string, number>>(new Map());
    const [wordDifficulty, setWordDifficulty] = useState<Map<string, boolean>>(new Map());
    const [consecutiveMatches, setConsecutiveMatches] = useState<number>(0);

    // Check if we're in dark mode
    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch words when component mounts
    useEffect(() => {
        async function fetchWords() {
            setLoading(true);
            try {
                const response = await getWords({
                    language: lang,
                    mediaId: mediaId,
                    limit: 50,
                });

                if (response.err) {
                    throw new Error(response.err);
                }

                setWords(response.data.words || []);
            } catch (err) {
                console.error("Error fetching words:", err);
                setError(err instanceof Error ? err.message : "Failed to fetch words");
            } finally {
                setLoading(false);
            }
        }

        if (lang) {
            fetchWords();
        }
    }, [lang, mediaId]);

    const isDark = mounted ? theme === 'dark' : false;

    // Initialize game when words are loaded
    useEffect(() => {
        if (words.length > 0) {
            initializeGame();
        }
    }, [words]);

    // Game timer
    useEffect(() => {
        if (gameStarted && !gameOver) {
            const timer = setInterval(() => {
                setGameTime(prev => prev + 1);
            }, 1000);
            setGameTimer(timer);
            return () => clearInterval(timer);
        } else if (gameTimer) {
            clearInterval(gameTimer);
        }
    }, [gameStarted, gameOver]);

    const initializeGame = () => {
        if (!words || words.length === 0) return;

        // Reset game state
        setFlippedCards([]);
        setMatchedCards([]);
        setMoves(0);
        setGameOver(false);
        setGameTime(0);
        setScore(0);
        setAttemptedMatches(new Map());
        setWordDifficulty(new Map());
        setConsecutiveMatches(0);
        setLastActionTime(Date.now());

        // Get a random subset of words (6 pairs = 12 cards)
        const gameWordCount = Math.min(6, Math.floor(words.length / 2));
        let selectedWords = [...words]
            .sort(() => 0.5 - Math.random())
            .slice(0, gameWordCount);

        // Create pairs (original word + translation)
        let cardPairs = selectedWords.flatMap(word => [
            {
                id: `${word.id}-original`,
                wordId: word.id,
                text: word.word,
                language: 'original',
                matched: false
            },
            {
                id: `${word.id}-translation`,
                wordId: word.id,
                text: word.translations?.[0]?.text || word.word,
                language: 'translation',
                matched: false
            }
        ]);

        // Shuffle the cards
        setGameCards(cardPairs.sort(() => 0.5 - Math.random()));
    };

    // Determine if a word is considered "hard" based on match performance
    const isWordHard = (wordId: string, timeTaken: number): boolean => {
        const attempts = attemptedMatches.get(wordId) || 0;

        // A word is considered hard if:
        // 1. It took more than 2 attempts to match, or
        // 2. It took longer than 5 seconds to match (after flipping the first card)
        return attempts > 2 || timeTaken > 5;
    };

    // Calculate score based on performance metrics
    const calculateMatchScore = (timeTaken: number, attempts: number): number => {
        let baseScore = 10; // Base points for a match

        // Bonus for quick matches
        if (timeTaken < 3) baseScore += 5;

        // Penalty for multiple attempts
        baseScore = Math.max(5, baseScore - (attempts - 1) * 2);

        // Bonus for consecutive matches
        if (consecutiveMatches > 0) {
            baseScore += Math.min(consecutiveMatches, 3) * 2;
        }

        return baseScore;
    };

    const handleCardClick = async (index: number) => {
        // Start game on first click
        if (!gameStarted) {
            setGameStarted(true);
            setLastActionTime(Date.now());
            return;
        }

        // Ignore if card is already flipped or matched
        if (flippedCards.includes(index) || matchedCards.includes(index) || flippedCards.length >= 2 || processingAction) {
            return;
        }

        const now = Date.now();
        const timeSinceLastAction = (now - lastActionTime) / 1000;
        setLastActionTime(now);

        // Flip the card
        const newFlippedCards = [...flippedCards, index];
        setFlippedCards(newFlippedCards);

        // Check for a match if we have 2 flipped cards
        if (newFlippedCards.length === 2) {
            setMoves(moves + 1);

            const [firstIndex, secondIndex] = newFlippedCards;
            const firstCard = gameCards[firstIndex];
            const secondCard = gameCards[secondIndex];

            // Check if the cards match (same wordId but different languages)
            if (firstCard.wordId === secondCard.wordId && firstCard.language !== secondCard.language) {
                // It's a match!
                const wordId = firstCard.wordId;

                // Update attempts for this word
                const attempts = (attemptedMatches.get(wordId) || 0) + 1;
                const newAttemptedMatches = new Map(attemptedMatches);
                newAttemptedMatches.set(wordId, attempts);
                setAttemptedMatches(newAttemptedMatches);

                // Determine if this word was hard to match
                const isHard = isWordHard(wordId, timeSinceLastAction);
                const newWordDifficulty = new Map(wordDifficulty);
                newWordDifficulty.set(wordId, isHard);
                setWordDifficulty(newWordDifficulty);

                // Calculate score for this match
                const matchScore = calculateMatchScore(timeSinceLastAction, attempts);

                // Update state
                setMatchedCards([...matchedCards, firstIndex, secondIndex]);
                setFlippedCards([]);
                setScore(score + matchScore);
                setConsecutiveMatches(prev => prev + 1);

                // Send data to the server to track the word learning
                if (wordId) {
                    setProcessingAction(true);
                    try {
                        await memoryGameAction({
                            wordId,
                            hard: isHard,
                            mediaId: mediaId,
                            // Additional context could be added here:
                            // timeTaken: timeSinceLastAction,
                            // attempts: attempts,
                            // score: matchScore
                        });
                    } catch (error) {
                        console.error("Error tracking word:", error);
                    } finally {
                        setProcessingAction(false);
                    }
                }
            } else {
                // Not a match - flip cards back after delay
                setTimeout(() => {
                    setFlippedCards([]);
                }, 1500);

                // Reset consecutive matches
                setConsecutiveMatches(0);

                // Track attempted matches for both cards
                const newAttemptedMatches = new Map(attemptedMatches);
                newAttemptedMatches.set(firstCard.wordId, (attemptedMatches.get(firstCard.wordId) || 0) + 1);
                newAttemptedMatches.set(secondCard.wordId, (attemptedMatches.get(secondCard.wordId) || 0) + 1);
                setAttemptedMatches(newAttemptedMatches);

                // Penalty for wrong match
                setScore(Math.max(0, score - 2));
            }

            // Check if game is over
            const updatedMatches = firstCard.wordId === secondCard.wordId
                ? [...matchedCards, firstIndex, secondIndex]
                : matchedCards;

            if (updatedMatches.length === gameCards.length) {
                setTimeout(() => {
                    // Save final game stats
                    const finalWords = Array.from(wordDifficulty.entries())
                        .filter(([id, _]) => updatedMatches.some(idx => gameCards[idx].wordId === id))
                        .map(([id, hard]) => ({
                            wordId: id,
                            hard
                        }));

                    // You could send this data to track overall game performance
                    console.log("Game completed:", {
                        score,
                        moves,
                        timeElapsed: gameTime,
                        words: finalWords
                    });

                    setGameOver(true);
                    setGameStarted(false);
                }, 1000);
            }
        }
    };

    const restartGame = () => {
        initializeGame();
        setGameStarted(false);
        setGameOver(false);
    };

    if (!mounted) {
        return null;
    }

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-br from-white via-zinc-50 to-sky-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4 md:p-6 lg:p-8 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-12 h-12 border-4 border-emerald-500 dark:border-emerald-400 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    // Show error state
    if (error || words.length === 0) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-br from-white via-zinc-50 to-sky-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4 md:p-6 lg:p-8">
                <div className="max-w-md mx-auto text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-amber-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">No Words Available</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {error || "There aren't enough words available to play the memory game. Please try with a different language or add more words."}
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-white via-zinc-50 to-sky-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4 md:p-6 lg:p-8">
            {/* Decorative background elements */}
            <div className="fixed top-20 right-20 w-64 h-64 bg-emerald-400/10 dark:bg-emerald-900/10 rounded-full blur-3xl -z-10" />
            <div className="fixed bottom-40 left-1/4 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-800/10 rounded-full blur-3xl -z-10" />

            <div className="max-w-7xl mx-auto">
                {/* Game header with title and info */}
                <GameHeader
                    title="Memory Game"
                    description="Match the word with its translation"
                    score={score}
                    moves={moves}
                    gameTime={gameTime}
                    poppins={poppins}
                    inter={inter}
                />

                {/* Game board */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 p-4 md:p-6"
                >
                    {!gameStarted && !gameOver && (
                        <div className="flex flex-col items-center justify-center">
                            <motion.button
                                initial={{ scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setGameStarted(true)}
                                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all duration-300"
                            >
                                Start Game
                            </motion.button>
                        </div>
                    )}

                    {(gameStarted || gameOver) && (
                        <>
                            {/* Consecutive matches indicator */}
                            {consecutiveMatches > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-4 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg inline-flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                                        {consecutiveMatches} Consecutive Matches!
                                    </span>
                                </motion.div>
                            )}

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                                {gameCards.map((card, index) => (
                                    <MemoryCard
                                        key={card.id}
                                        text={card.text}
                                        isFlipped={flippedCards.includes(index) || matchedCards.includes(index)}
                                        isMatched={matchedCards.includes(index)}
                                        onClick={() => handleCardClick(index)}
                                        isDark={isDark}
                                        language={card.language}
                                        lang={lang}
                                    />
                                ))}
                            </div>

                            <ScorePanel
                                score={score}
                                moves={moves}
                                timeElapsed={gameTime}
                                matchedPairs={matchedCards.length / 2}
                                totalPairs={gameCards.length / 2}
                                isDark={isDark}
                                inter={inter}
                            />
                        </>
                    )}

                    {/* Game controls */}
                    <GameControls
                        onRestart={restartGame}
                        loading={processingAction}
                    />
                </motion.div>

                {/* Game over modal */}
                <AnimatePresence>
                    {gameOver && (
                        <GameOverModal
                            score={score}
                            moves={moves}
                            timeElapsed={gameTime}
                            onRestart={restartGame}
                            poppins={poppins}
                            inter={inter}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
