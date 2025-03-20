'use client';
import { memoryGameAction } from '@backend/domain/actions/Games/memory.action';
import { getWords } from '@backend/domain/actions/Word/getWords.action';
import LoaderSpinner from '@core/LoaderSpinner';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

type GameWord = {
    id: string;
    word: string;
    meaning: string;
    normalized: string; // Lowercase, no accents or special characters
};

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');
const MAX_ATTEMPTS = 6;

export const Body = ({
    words,
    lang,
    mediaId
}: {
    words: { word: string }[],
    lang: string,
    mediaId?: string
}) => {
    const [allWords, setAllWords] = useState<GameWord[]>([]);
    const [currentWord, setCurrentWord] = useState<GameWord | null>(null);
    const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
    const [incorrectGuesses, setIncorrectGuesses] = useState<string[]>([]);
    const [correctGuesses, setCorrectGuesses] = useState<string[]>([]);
    const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
    const [isLoading, setIsLoading] = useState(true);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [successiveWins, setSuccessiveWins] = useState(0);

    // Normalize a string (remove accents, lowercase)
    const normalizeString = (str: string) => {
        return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z]/g, '');
    };

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
                const gameWords = response.data.words
                    .filter(w =>
                        w.translations &&
                        w.translations.length > 0 &&
                        w.translations[0].meaning &&
                        w.word.length >= 4 &&
                        w.word.length <= 12
                    )
                    .map(w => ({
                        id: w.id,
                        word: w.word,
                        meaning: w.translations?.[0]?.meaning || 'No meaning available',
                        normalized: normalizeString(w.word)
                    }));

                setAllWords(prev => [...prev, ...gameWords]);
                setCurrentIndex(prev => prev + 20);
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
        } else if (!currentWord && allWords.length > 0) {
            startNewRound();
        }
    }, [allWords, fetchWords, currentWord]);

    // Start a new game round
    const startNewRound = () => {
        if (allWords.length === 0) {
            fetchWords();
            return;
        }

        const nextWord = allWords[0];
        setCurrentWord(nextWord);
        setAllWords(prev => prev.slice(1));

        // Reset game state
        setGuessedLetters([]);
        setIncorrectGuesses([]);
        setCorrectGuesses([]);
        setGameStatus('playing');
    };

    // Handle letter guesses
    const handleLetterGuess = async (letter: string) => {
        if (gameStatus !== 'playing' || guessedLetters.includes(letter) || !currentWord) return;

        // Add to guessed letters
        setGuessedLetters(prev => [...prev, letter]);

        // Check if letter is in the word
        if (currentWord.normalized.includes(letter)) {
            setCorrectGuesses(prev => [...prev, letter]);

            // Check for win
            const wordLetters = [...new Set(currentWord.normalized.split(''))];
            if (wordLetters.every(l => [...correctGuesses, letter].includes(l))) {
                setGameStatus('won');
                setScore(prev => prev + 10 + (5 * successiveWins));
                setSuccessiveWins(prev => prev + 1);

                // Record success
                try {
                    await memoryGameAction({
                        wordId: currentWord.id,
                        hard: false,
                        mediaId
                    });
                } catch (error) {
                    console.error("Error recording success:", error);
                }

                // Move to next round after delay
                setTimeout(() => {
                    setRound(prev => prev + 1);
                    startNewRound();
                }, 2000);
            }
        } else {
            // Add to incorrect guesses
            const newIncorrectGuesses = [...incorrectGuesses, letter];
            setIncorrectGuesses(newIncorrectGuesses);

            // Check for loss
            if (newIncorrectGuesses.length >= MAX_ATTEMPTS) {
                setGameStatus('lost');
                setSuccessiveWins(0);

                // Record failure
                try {
                    await memoryGameAction({
                        wordId: currentWord.id,
                        hard: true,
                        mediaId
                    });
                } catch (error) {
                    console.error("Error recording failure:", error);
                }

                // Move to next round after delay
                setTimeout(() => {
                    startNewRound();
                }, 2000);
            }
        }
    };

    // Render word with guessed letters
    const renderWord = () => {
        if (!currentWord) return null;

        return currentWord.word.split('').map((letter, idx) => {
            const normalizedLetter = normalizeString(letter);

            // Show letter if guessed or if it's not a letter (like hyphen or space)
            const revealed = correctGuesses.includes(normalizedLetter) || !/[a-z]/i.test(letter) || gameStatus === 'lost';

            return (
                <motion.div
                    key={`letter-${idx}`}
                    className={clsx(
                        "w-10 h-12 mx-1 flex items-center justify-center rounded-lg text-xl font-bold border-b-2",
                        revealed
                            ? gameStatus === 'won'
                                ? "border-emerald-400 text-emerald-400"
                                : gameStatus === 'lost'
                                    ? "border-rose-400 text-rose-400"
                                    : "border-indigo-400 text-white"
                            : "border-gray-600 text-transparent"
                    )}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: revealed && gameStatus === 'won' ? [1, 1.2, 1] : 1
                    }}
                    transition={{
                        delay: idx * 0.05,
                        scale: { repeat: gameStatus === 'won' ? 3 : 0, repeatType: "reverse", duration: 0.3 }
                    }}
                >
                    {revealed ? letter : "_"}
                </motion.div>
            );
        });
    };

    // Render hangman figure
    const renderHangman = () => {
        const parts = [
            // Base
            <rect key="base" x="10" y="140" width="80" height="10" fill="currentColor" />,
            // Pole
            <rect key="pole" x="30" y="20" width="10" height="120" fill="currentColor" />,
            // Top
            <rect key="top" x="30" y="20" width="60" height="10" fill="currentColor" />,
            // Rope
            <rect key="rope" x="80" y="20" width="5" height="20" fill="currentColor" />,
            // Head
            <circle key="head" cx="82.5" cy="55" r="15" stroke="currentColor" strokeWidth="5" fill="none" />,
            // Body
            <rect key="body" x="80" y="70" width="5" height="30" fill="currentColor" />,
            // Left arm
            <line key="left-arm" x1="82.5" y1="80" x2="65" y2="70" stroke="currentColor" strokeWidth="5" />,
            // Right arm
            <line key="right-arm" x1="82.5" y1="80" x2="100" y2="70" stroke="currentColor" strokeWidth="5" />,
            // Left leg
            <line key="left-leg" x1="82.5" y1="100" x2="65" y2="120" stroke="currentColor" strokeWidth="5" />,
            // Right leg
            <line key="right-leg" x1="82.5" y1="100" x2="100" y2="120" stroke="currentColor" strokeWidth="5" />,
        ];

        // Different parts shown based on incorrect guesses
        let visibleParts;

        switch (incorrectGuesses.length) {
            case 0: visibleParts = parts.slice(0, 3); break;
            case 1: visibleParts = parts.slice(0, 4); break;
            case 2: visibleParts = parts.slice(0, 5); break;
            case 3: visibleParts = parts.slice(0, 6); break;
            case 4: visibleParts = parts.slice(0, 8); break;
            case 5: visibleParts = parts.slice(0, 9); break;
            case 6: visibleParts = parts.slice(0, 10); break;
            default: visibleParts = parts.slice(0, 3);
        }

        return (
            <svg
                viewBox="0 0 150 150"
                className={clsx(
                    "w-full h-full",
                    gameStatus === 'lost' ? "text-rose-500" :
                        gameStatus === 'won' ? "text-emerald-400" : "text-zinc-400"
                )}
            >
                {visibleParts.map((part, i) => (
                    <motion.g
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        {part}
                    </motion.g>
                ))}
            </svg>
        );
    };

    if (isLoading && allWords.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <LoaderSpinner size="large" />
                    <p className="mt-4 text-zinc-300 dark:text-zinc-400">
                        Loading hangman game...
                    </p>
                </div>
            </div>
        );
    }

    if (!currentWord) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <LoaderSpinner size="large" />
                    <p className="mt-4 text-zinc-300 dark:text-zinc-400">
                        Preparing new word...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-full w-full flex items-center justify-center p-6">
            {/* Background decorations */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-40 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '12s' }} />

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left column: Hangman figure and word */}
                <div className="flex flex-col items-center">
                    {/* Score and round info */}
                    <div className="w-full flex justify-between mb-6">
                        <motion.div
                            className="bg-gray-800/70 backdrop-blur-sm rounded-full px-4 py-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="text-white font-medium">Round: <span className="text-emerald-400">{round}</span></span>
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

                    {/* Hangman drawing */}
                    <motion.div
                        className="w-52 h-52 mb-8"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {renderHangman()}
                    </motion.div>

                    {/* Word to guess */}
                    <motion.div
                        className="flex flex-wrap justify-center mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {renderWord()}
                    </motion.div>

                    {/* Game status message */}
                    <AnimatePresence>
                        {gameStatus !== 'playing' && (
                            <motion.div
                                className={clsx(
                                    "px-6 py-3 rounded-lg",
                                    gameStatus === 'won' ? "bg-emerald-500/80" : "bg-rose-500/80"
                                )}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                            >
                                <p className="text-white font-medium">
                                    {gameStatus === 'won'
                                        ? `Correct! +${10 + (5 * (successiveWins - 1))} points.`
                                        : `The word was "${currentWord.word}"`}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right column: Word meaning and keyboard */}
                <div className="flex flex-col">
                    {/* Word meaning */}
                    <motion.div
                        className="mb-6 bg-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-xl p-4 shadow-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <h3 className="text-zinc-300 text-sm uppercase tracking-wider mb-2">Definition</h3>
                        <p className="text-white">{currentWord.meaning}</p>
                    </motion.div>

                    {/* Remaining attempts */}
                    <motion.div
                        className="mb-6 flex justify-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="bg-gray-800/70 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                            <span className="text-white">Attempts remaining:</span>
                            <div className="flex">
                                {Array.from({ length: MAX_ATTEMPTS - incorrectGuesses.length }).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-3 h-3 mx-0.5 rounded-full bg-emerald-500"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.3 + i * 0.1 }}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Keyboard */}
                    <motion.div
                        className="grid grid-cols-7 sm:grid-cols-9 gap-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        {ALPHABET.map((letter, index) => {
                            const isGuessed = guessedLetters.includes(letter);
                            const isCorrect = currentWord.normalized.includes(letter) && isGuessed;
                            const isIncorrect = !currentWord.normalized.includes(letter) && isGuessed;

                            return (
                                <motion.button
                                    key={letter}
                                    className={clsx(
                                        "w-9 h-9 flex items-center justify-center rounded-lg font-bold text-lg transition-all",
                                        isGuessed
                                            ? isCorrect
                                                ? "bg-emerald-500/80 text-white cursor-default"
                                                : "bg-rose-500/80 text-white cursor-default"
                                            : "bg-gray-800/60 text-white hover:bg-indigo-600/70 border border-gray-700/50"
                                    )}
                                    onClick={() => !isGuessed && handleLetterGuess(letter)}
                                    disabled={isGuessed || gameStatus !== 'playing'}
                                    whileHover={!isGuessed && gameStatus === 'playing' ? { scale: 1.1 } : {}}
                                    whileTap={!isGuessed && gameStatus === 'playing' ? { scale: 0.95 } : {}}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        transition: { delay: 0.4 + index * 0.02 }
                                    }}
                                >
                                    {letter.toUpperCase()}
                                </motion.button>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
