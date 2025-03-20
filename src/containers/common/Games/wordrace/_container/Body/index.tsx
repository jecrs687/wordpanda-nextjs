'use client';
import { memoryGameAction } from '@backend/domain/actions/Games/memory.action';
import { getWords } from '@backend/domain/actions/Word/getWords.action';
import LoaderSpinner from '@core/LoaderSpinner';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { WordWithTranslationsAndUserWords } from 'src/app/api/words/route';

type GameWord = {
    id: string;
    word: string;
    meaning: string;
    status: 'waiting' | 'active' | 'completed' | 'failed';
    position: number;
};

const TOTAL_TIME = 60; // Game duration in seconds
const WORD_SPEED_INITIAL = 3; // Lower is faster
const MAX_ACTIVE_WORDS = 5;

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
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
    const [gameStatus, setGameStatus] = useState<'ready' | 'playing' | 'finished'>('ready');
    const [wordsTyped, setWordsTyped] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [typingAttempts, setTypingAttempts] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [wordSpeed, setWordSpeed] = useState(WORD_SPEED_INITIAL);

    const inputRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const wordSpawnRef = useRef<NodeJS.Timeout | null>(null);
    const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

    // Fetch words
    const fetchWords = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getWords({
                language: lang,
                ...(mediaId ? { mediaId } : { words: words.slice(currentIndex, currentIndex + 50).map(x => x.word) }),
                limit: 50
            });

            if (response?.data?.words) {
                const filteredWords = response.data.words.filter(word =>
                    word.translations &&
                    word.translations.length > 0 &&
                    word.translations[0].meaning &&
                    word.word.length >= 3
                );

                setAllWords(prev => [...prev, ...filteredWords]);
                setCurrentIndex(prev => prev + 50);
            }
        } catch (error) {
            console.error("Error fetching words:", error);
        } finally {
            setIsLoading(false);
        }
    }, [mediaId, words, currentIndex, lang]);

    // Initialize game
    useEffect(() => {
        if (allWords.length === 0) {
            fetchWords();
        }
    }, [allWords.length, fetchWords]);

    // Spawn new words periodically during gameplay
    useEffect(() => {
        if (gameStatus === 'playing') {
            const activeWords = gameWords.filter(w => w.status === 'active' || w.status === 'waiting');

            if (activeWords.length < MAX_ACTIVE_WORDS && allWords.length > 0) {
                // Add a new word to the game
                const newWord = allWords[0];
                const gameWord: GameWord = {
                    id: newWord.id,
                    word: newWord.word.toLowerCase(),
                    meaning: newWord.translations?.[0]?.meaning || '',
                    status: 'waiting',
                    position: 0
                };

                setGameWords(prev => [...prev, gameWord]);
                setAllWords(prev => prev.slice(1));

                // If running low on words, fetch more
                if (allWords.length < 10) {
                    fetchWords();
                }
            }

            // Set up word spawn timer
            wordSpawnRef.current = setTimeout(() => {
                // The next spawn interval is faster as level increases
                const spawnInterval = Math.max(1000, 2000 - (level * 200));
                if (wordSpawnRef.current) clearTimeout(wordSpawnRef.current);
                wordSpawnRef.current = setTimeout(() => { }, spawnInterval);
            }, 2000);

            return () => {
                if (wordSpawnRef.current) clearTimeout(wordSpawnRef.current);
            };
        }
    }, [gameWords, gameStatus, allWords, level, fetchWords]);

    // Game loop - move words down the screen
    useEffect(() => {
        if (gameStatus === 'playing') {
            gameLoopRef.current = setInterval(() => {
                setGameWords(prev => {
                    // Move active words down
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
                                return { ...word, status: 'failed' };
                            }

                            return { ...word, position: newPosition };
                        }

                        return word;
                    });
                });
            }, wordSpeed * 500); // Controls word falling speed

            return () => {
                if (gameLoopRef.current) clearInterval(gameLoopRef.current);
            };
        }
    }, [gameStatus, wordSpeed]);

    // Game timer
    useEffect(() => {
        if (gameStatus === 'playing') {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current!);
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
    }, [gameStatus]);

    // Focus input when game starts
    useEffect(() => {
        if (gameStatus === 'playing' && inputRef.current) {
            inputRef.current.focus();
        }
    }, [gameStatus]);

    // Start game
    const startGame = () => {
        setGameStatus('playing');
        setTimeLeft(TOTAL_TIME);
        setScore(0);
        setLevel(1);
        setWordsTyped(0);
        setAccuracy(100);
        setTypingAttempts(0);
        setGameWords([]);
        setWordSpeed(WORD_SPEED_INITIAL);

        // Focus input
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    // End game
    const endGame = () => {
        setGameStatus('finished');

        // Clear timers
        if (timerRef.current) clearInterval(timerRef.current);
        if (wordSpawnRef.current) clearTimeout(wordSpawnRef.current);
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };

    // Handle user input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setUserInput(value);

        // Track typing attempts
        if (value.length > 0) {
            setTypingAttempts(prev => prev + 1);
        }

        // Check if input matches any active word
        const matchedWordIndex = gameWords.findIndex(
            word => word.status === 'active' && word.word.toLowerCase() === value.toLowerCase()
        );

        if (matchedWordIndex !== -1) {
            const matchedWord = gameWords[matchedWordIndex];

            // Update score based on word length and level
            const wordScore = matchedWord.word.length * level;
            setScore(prev => prev + wordScore);

            // Track words typed
            setWordsTyped(prev => prev + 1);

            // Update accuracy
            setAccuracy(Math.round((wordsTyped + 1) / (typingAttempts + 1) * 100));

            // Record word success
            try {
                memoryGameAction({
                    wordId: matchedWord.id,
                    hard: false,
                    mediaId
                });
            } catch (error) {
                console.error("Error recording word:", error);
            }

            // Mark word as completed
            setGameWords(prev =>
                prev.map((word, idx) =>
                    idx === matchedWordIndex
                        ? { ...word, status: 'completed' }
                        : word
                )
            );

            // Clear input
            setUserInput('');

            // Check if level up is needed
            if ((wordsTyped + 1) % 10 === 0) {
                setLevel(prev => Math.min(prev + 1, 5));
                setWordSpeed(prev => Math.max(prev - 0.3, 1)); // Speed up the game
            }
        }
    };

    // Clean up completed/failed words
    useEffect(() => {
        if (gameStatus === 'playing') {
            const completedWords = gameWords.filter(w => w.status === 'completed');
            const failedWords = gameWords.filter(w => w.status === 'failed');

            if (completedWords.length > 0 || failedWords.length > 0) {
                setTimeout(() => {
                    setGameWords(prev =>
                        prev.filter(word =>
                            word.status !== 'completed' && word.status !== 'failed'
                        )
                    );
                }, 500);
            }
        }
    }, [gameWords, gameStatus]);

    // Loading state
    if (isLoading && allWords.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <LoaderSpinner size="large" />
                    <p className="mt-4 text-zinc-300 dark:text-zinc-400">
                        Loading word race game...
                    </p>
                </div>
            </div>
        );
    }

    // Game start screen
    if (gameStatus === 'ready') {
        return (
            <div className="relative h-full w-full flex items-center justify-center p-6">
                <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl -z-10 animate-pulse" />
                <div className="absolute bottom-40 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '8s' }} />

                <motion.div
                    className="max-w-lg w-full bg-gray-900/60 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-8 shadow-xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl font-bold text-white text-center mb-6">Word Race</h2>

                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8">
                        <h3 className="text-xl text-white font-medium mb-4">How to Play:</h3>
                        <ul className="text-zinc-300 space-y-2">
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Words will appear and fall down the screen</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Type each word before it reaches the bottom</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Score more points by typing faster and correctly</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>The game gets faster as your level increases</span>
                            </li>
                        </ul>
                    </div>

                    <div className="flex justify-center">
                        <motion.button
                            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg rounded-lg shadow-lg"
                            onClick={startGame}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Start Game
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Game finished screen
    if (gameStatus === 'finished') {
        return (
            <div className="relative h-full w-full flex items-center justify-center p-6">
                <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl -z-10 animate-pulse" />
                <div className="absolute bottom-40 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '8s' }} />

                <motion.div
                    className="max-w-lg w-full bg-gray-900/60 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-8 shadow-xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl font-bold text-white text-center mb-6">Game Over!</h2>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center">
                            <p className="text-zinc-400 text-sm mb-1">Score</p>
                            <p className="text-emerald-400 text-2xl font-bold">{score}</p>
                        </div>

                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center">
                            <p className="text-zinc-400 text-sm mb-1">Level</p>
                            <p className="text-indigo-400 text-2xl font-bold">{level}</p>
                        </div>

                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center">
                            <p className="text-zinc-400 text-sm mb-1">Words Typed</p>
                            <p className="text-amber-400 text-2xl font-bold">{wordsTyped}</p>
                        </div>

                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center">
                            <p className="text-zinc-400 text-sm mb-1">Accuracy</p>
                            <p className="text-cyan-400 text-2xl font-bold">{accuracy}%</p>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <motion.button
                            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg rounded-lg shadow-lg"
                            onClick={startGame}
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

    // Active gameplay screen
    return (
        <div className="relative h-full w-full flex flex-col p-6">
            {/* Background decorations */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-40 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '8s' }} />

            {/* Game HUD */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-gray-800/70 backdrop-blur-sm rounded-full px-4 py-2">
                        <span className="text-emerald-400 font-medium">Score: {score}</span>
                    </div>

                    <div className="bg-gray-800/70 backdrop-blur-sm rounded-full px-4 py-2">
                        <span className="text-indigo-400 font-medium">Level: {level}</span>
                    </div>
                </div>

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
            </div>

            {/* Game area */}
            <div className="flex-1 bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-xl overflow-hidden relative">
                {/* Falling words */}
                <div className="absolute inset-0">
                    <AnimatePresence>
                        {gameWords.map((word, idx) => (
                            word.status === 'active' && (
                                <motion.div
                                    key={`${word.id}-${idx}`}
                                    className="absolute left-0 flex w-full justify-center"
                                    initial={{ y: -50, opacity: 0 }}
                                    animate={{
                                        y: word.position * 50,
                                        opacity: 1
                                    }}
                                    exit={{
                                        scale: word.status === 'completed' as GameWord['status'] ? 1.5 : 1,
                                        opacity: 0,
                                        transition: { duration: 0.3 }
                                    }}
                                    style={{
                                        left: `${(idx % 5) * 20 + 5}%`
                                    }}
                                >
                                    <div className={clsx(
                                        "px-4 py-2 rounded-lg text-white font-medium",
                                        word.status === 'completed' as GameWord['status']
                                            ? "bg-emerald-500/80"
                                            : word.position >= 8
                                                ? "bg-rose-500/80"
                                                : "bg-indigo-600/80"
                                    )}>
                                        {word.word}
                                    </div>
                                </motion.div>
                            )
                        ))}
                    </AnimatePresence>
                </div>

                {/* Bottom area */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900/80 to-transparent" />
            </div>

            {/* Input area */}
            <div className="mt-4">
                <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder="Type the falling words here..."
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/60 border-2 border-gray-700/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50 transition-all"
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck="false"
                />
            </div>
        </div>
    );
};
