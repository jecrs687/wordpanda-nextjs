'use client';

import { memoryGameAction } from '@backend/domain/actions/Games/memory.action';
import { getWords } from '@backend/domain/actions/Word/getWords.action';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Gauge, Heart, Play, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { WordWithTranslationsAndUserWords } from 'src/app/api/words/route';
import Badge from '../../../_components/Badge';
import ConfettiEffect from '../../../_components/ConfettiEffect';
import GameButton from '../../../_components/GameButton';
import { LoadingGames } from '../../../_container/Loading';
import FallingWord from '../../_components/FallingWord';

type GameWord = {
    id: string;
    word: string;
    meaning: string;
    status: 'waiting' | 'active' | 'correct' | 'failed';
    position: number;
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
    // Game state
    const [allWords, setAllWords] = useState<WordWithTranslationsAndUserWords[]>([]);
    const [gameWords, setGameWords] = useState<GameWord[]>([]);
    const [currentInput, setCurrentInput] = useState('');
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [lives, setLives] = useState(3);
    const [timeLeft, setTimeLeft] = useState(60);
    const [gameState, setGameState] = useState<'ready' | 'playing' | 'paused' | 'gameOver'>('ready');
    const [wordsTyped, setWordsTyped] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [typingAttempts, setTypingAttempts] = useState(0);
    const [wordSpeed, setWordSpeed] = useState(1); // 1 = slow, 2 = medium, 3 = fast
    const [fetchIndex, setFetchIndex] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);

    // Refs
    const inputRef = useRef<HTMLInputElement>(null);
    const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Fetch words
    const fetchWords = useCallback(async () => {
        try {
            const response = await getWords({
                language: lang,
                ...(mediaId
                    ? { mediaId }
                    : { words: words.slice(fetchIndex, fetchIndex + 30).map(x => x.word) }),
                limit: 30
            });

            if (response?.data?.words) {
                const filteredWords = response.data.words.filter(word =>
                    word.translations?.length > 0 &&
                    word.translations[0].meaning &&
                    word.word.length >= 3 &&
                    word.word.length <= 12 // Only use words with reasonable length
                );

                setAllWords(prev => [...prev, ...filteredWords]);
                setFetchIndex(prev => prev + 30);
            }
        } catch (error) {
            console.error("Error fetching words:", error);
        }
    }, [mediaId, words, fetchIndex, lang]);

    // Initialize
    useEffect(() => {
        if (allWords.length === 0) {
            fetchWords();
        }
    }, [allWords.length, fetchWords]);

    // Game loop - handle falling words
    useEffect(() => {
        if (gameState === 'playing') {
            // Generate a new word occasionally
            const wordGenerationInterval = setInterval(() => {
                if (gameWords.filter(w => w.status === 'active' || w.status === 'waiting').length < 5) {
                    // Add a new word if we have fewer than 5 active words
                    if (allWords.length > 0) {
                        const randomIndex = Math.floor(Math.random() * allWords.length);
                        const newWord = allWords[randomIndex];

                        setGameWords(prev => [
                            ...prev,
                            {
                                id: newWord.id,
                                word: newWord.word.toLowerCase(),
                                meaning: newWord.translations?.[0]?.meaning || 'No meaning',
                                status: 'waiting',
                                position: 0
                            }
                        ]);

                        // Remove used word
                        setAllWords(prev => prev.filter((_, idx) => idx !== randomIndex));
                    } else {
                        // If we're running low on words, fetch more
                        fetchWords();
                    }
                }
            }, 3000 / level); // Faster word generation at higher levels

            // Move words down
            gameLoopRef.current = setInterval(() => {
                setGameWords(prev => {
                    // If no words left to process, return unchanged
                    if (prev.length === 0) return prev;

                    return prev.map(word => {
                        if (word.status === 'waiting') {
                            // Activate waiting words
                            return { ...word, status: 'active' };
                        }

                        if (word.status === 'active') {
                            // Move active words down
                            const newPosition = word.position + 1;

                            // Mark as failed if word reaches bottom
                            if (newPosition >= 10) {
                                // Lose a life when a word reaches the bottom
                                setLives(l => Math.max(0, l - 1));
                                return { ...word, status: 'failed' };
                            }

                            return { ...word, position: newPosition };
                        }

                        return word;
                    });
                });
            }, 500 / wordSpeed); // Controls word falling speed

            return () => {
                clearInterval(wordGenerationInterval);
                if (gameLoopRef.current) clearInterval(gameLoopRef.current);
            };
        }
    }, [gameState, level, wordSpeed, allWords, fetchWords, gameWords]);

    // Game timer
    useEffect(() => {
        if (gameState === 'playing') {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        endGame();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => {
                if (timerRef.current) clearInterval(timerRef.current);
            };
        }
    }, [gameState]);

    // Life counter - end game when lives run out
    useEffect(() => {
        if (lives <= 0 && gameState === 'playing') {
            endGame();
        }
    }, [lives, gameState]);

    // Focus input when game starts
    useEffect(() => {
        if (gameState === 'playing' && inputRef.current) {
            inputRef.current.focus();
        }
    }, [gameState]);

    // Check for level up based on score
    useEffect(() => {
        if (gameState === 'playing') {
            // Level up every 100 points
            const newLevel = Math.floor(score / 100) + 1;
            if (newLevel > level && newLevel <= 3) {
                setLevel(newLevel);
                setWordSpeed(newLevel);
                // Give bonus time for leveling up
                setTimeLeft(prev => prev + 15);
            }
        }
    }, [score, level, gameState]);

    // Start game
    const startGame = () => {
        // Reset game state
        setGameWords([]);
        setCurrentInput('');
        setScore(0);
        setLevel(1);
        setLives(3);
        setTimeLeft(60);
        setWordsTyped(0);
        setAccuracy(100);
        setTypingAttempts(0);
        setWordSpeed(1);
        setGameState('playing');

        // Focus input
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    // End game
    const endGame = () => {
        setGameState('gameOver');

        // Clear timers
        if (timerRef.current) clearInterval(timerRef.current);
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setCurrentInput(value);

        // Count typing attempts for accuracy calculation
        setTypingAttempts(prev => prev + 1);

        // Check if input matches any active word
        const matchedWordIndex = gameWords.findIndex(
            word => word.status === 'active' && word.word.toLowerCase() === value
        );

        if (matchedWordIndex !== -1) {
            // Word matched!
            const matchedWord = gameWords[matchedWordIndex];

            // Record success
            try {
                memoryGameAction({
                    wordId: matchedWord.id,
                    hard: false,
                    mediaId
                });
            } catch (error) {
                console.error("Error recording word success:", error);
            }

            // Calculate points based on position (higher = more points)
            const positionBonus = (10 - matchedWord.position) * 2;
            const levelBonus = level * 5;
            const points = 10 + positionBonus + levelBonus;

            // Update game state
            setScore(prev => prev + points);
            setWordsTyped(prev => prev + 1);
            setCurrentInput('');

            // Show confetti for correct word
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 1000);

            // Mark word as correct
            setGameWords(prev =>
                prev.map((word, idx) =>
                    idx === matchedWordIndex
                        ? { ...word, status: 'correct' }
                        : word
                )
            );

            // After a delay, remove the word
            setTimeout(() => {
                setGameWords(prev => prev.filter((_, idx) => idx !== matchedWordIndex));
            }, 500);

            // Update accuracy
            const correctChars = matchedWord.word.length;
            const totalAttempts = typingAttempts + 1; // Include this successful attempt
            const newAccuracy = Math.min(100, Math.round((correctChars / totalAttempts) * 100));
            setAccuracy(newAccuracy);
        }
    };

    // Format time as mm:ss
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Loading state
    if (allWords.length === 0) {
        return <LoadingGames />;
    }

    // Render game UI
    if (gameState === 'ready') {
        return (
            <div className="w-full max-w-3xl mx-auto">
                <motion.div
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Word Race</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            Type the falling words before they reach the bottom. You have 3 lives and 60 seconds!
                        </p>
                    </div>

                    <div className="bg-gray-100/80 dark:bg-gray-700/80 rounded-xl p-4 mb-6">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">How to Play:</h3>
                        <ul className="text-gray-600 dark:text-gray-300 space-y-1 text-sm">
                            <li>• Words will fall from the top of the screen</li>
                            <li>• Type each word correctly to clear it</li>
                            <li>• If a word reaches the bottom, you lose a life</li>
                            <li>• The game gets faster as you level up</li>
                            <li>• Score as many points as you can before time runs out!</li>
                        </ul>
                    </div>

                    <div className="flex justify-center">
                        <GameButton
                            onClick={startGame}
                            variant="primary"
                            size="lg"
                            icon={<Play className="h-5 w-5" />}
                        >
                            Start Game
                        </GameButton>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (gameState === 'gameOver') {
        return (
            <div className="w-full max-w-3xl mx-auto">
                <motion.div
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 shadow-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex justify-center mb-6">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full">
                            <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
                        Game Over!
                    </h2>

                    <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                        {lives <= 0
                            ? 'You ran out of lives!'
                            : 'Time\'s up! Great effort!'}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-100/80 dark:bg-gray-800/80 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Final Score</p>
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{score}</p>
                        </div>

                        <div className="bg-gray-100/80 dark:bg-gray-800/80 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Words Typed</p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{wordsTyped}</p>
                        </div>

                        <div className="bg-gray-100/80 dark:bg-gray-800/80 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Accuracy</p>
                            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{accuracy}%</p>
                        </div>

                        <div className="bg-gray-100/80 dark:bg-gray-800/80 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Level Reached</p>
                            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{level}</p>
                        </div>
                    </div>

                    <GameButton
                        onClick={startGame}
                        variant="primary"
                        size="lg"
                        fullWidth
                        icon={<RefreshCw className="h-5 w-5" />}
                    >
                        Play Again
                    </GameButton>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Confetti effect for correct answers */}
            <ConfettiEffect active={showConfetti} pieces={30} />

            {/* Game header stats */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                <div className="flex flex-wrap gap-2">
                    <Badge variant="success" size="md">Score: {score}</Badge>
                    <Badge variant="primary" size="md">Level: {level}</Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                    <div className="flex">
                        {[...Array(3)].map((_, idx) => (
                            <Heart
                                key={idx}
                                className={`h-5 w-5 ${idx < lives ? 'text-rose-500 fill-rose-500' : 'text-gray-300 dark:text-gray-600'}`}
                            />
                        ))}
                    </div>

                    <Badge
                        variant={timeLeft < 15 ? "danger" : "info"}
                        size="md"
                        pulse={timeLeft < 15}
                    >
                        {formatTime(timeLeft)}
                    </Badge>
                </div>
            </div>

            {/* Game area */}
            <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 rounded-xl h-[400px] overflow-hidden">
                {/* Grid lines for visual reference */}
                <div className="absolute inset-0 grid grid-rows-10 pointer-events-none">
                    {[...Array(10)].map((_, idx) => (
                        <div
                            key={idx}
                            className="border-b border-dashed border-gray-200 dark:border-gray-700/50"
                        />
                    ))}
                </div>

                {/* Game gauge */}
                <div className="absolute top-2 right-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-700/80 px-2 py-1 rounded-full">
                        <Gauge className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                        <span>Speed: {wordSpeed}x</span>
                    </div>
                </div>

                {/* Falling words */}
                <div className="relative h-full">
                    <AnimatePresence>
                        {gameWords.map((word) => (
                            word.status === 'active' && (
                                <FallingWord
                                    key={word.id}
                                    word={word.word}
                                    position={word.position}
                                    isCorrect={false} // Adjusted to avoid type mismatch
                                />
                            )
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Input field */}
            <div className="mt-4">
                <input
                    ref={inputRef}
                    type="text"
                    value={currentInput}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 text-center font-medium text-lg"
                    placeholder="Type the words here..."
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck="false"
                />
            </div>
        </div>
    );
};
