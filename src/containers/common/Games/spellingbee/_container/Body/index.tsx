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
    translations: string[];
    difficult: boolean;
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
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [level, setLevel] = useState(1);
    const [gameOver, setGameOver] = useState(false);
    const [revealedHints, setRevealedHints] = useState<number[]>([]);
    const [hintCount, setHintCount] = useState(3);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [playedAudio, setPlayedAudio] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

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
                // Filter words with meaning and at least 4 characters
                const filteredWords = response.data.words.filter(word =>
                    word.translations &&
                    word.translations.length > 0 &&
                    word.translations[0].meaning &&
                    word.word.length >= 4
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

    // Prepare game words
    useEffect(() => {
        if (allWords.length > 0 && gameWords.length === 0) {
            const prepared = allWords.slice(0, 20).map(word => ({
                id: word.id,
                word: word.word.toLowerCase(),
                meaning: word.translations?.[0]?.meaning || '',
                translations: word.translations?.[0]?.translations?.map(t => t.word) || [],
                difficult: word.word.length > 6
            }));

            // Sort by difficulty (shorter words first)
            prepared.sort((a, b) => a.word.length - b.word.length);

            setGameWords(prepared);
        }
    }, [allWords, gameWords.length]);

    // Initialize
    useEffect(() => {
        if (allWords.length === 0) {
            fetchWords();
        }
    }, [allWords.length, fetchWords]);

    // Focus input when current word changes
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
        setPlayedAudio(false);
    }, [currentWordIndex]);

    const getCurrentWord = useCallback(() => {
        return gameWords[currentWordIndex] || null;
    }, [gameWords, currentWordIndex]);

    const playAudio = useCallback(() => {
        if (!window.speechSynthesis) return;

        const currentWord = getCurrentWord();
        if (!currentWord) return;

        const utterance = new SpeechSynthesisUtterance(currentWord.word);
        utterance.lang = lang;
        utterance.rate = 0.8; // Slightly slower

        window.speechSynthesis.speak(utterance);
        setPlayedAudio(true);
    }, [getCurrentWord, lang]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
    };

    const checkAnswer = async () => {
        const currentWord = getCurrentWord();
        if (!currentWord) return;

        const isWordCorrect = userInput.trim().toLowerCase() === currentWord.word.toLowerCase();
        setIsCorrect(isWordCorrect);

        if (isWordCorrect) {
            // Add points based on word difficulty and level
            const points = currentWord.difficult ? 20 * level : 10 * level;
            setScore(prev => prev + points);

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

            // Move to next word after delay
            setTimeout(() => {
                setUserInput('');
                setIsCorrect(null);
                setRevealedHints([]);

                // Increase level every 5 words
                if ((currentWordIndex + 1) % 5 === 0 && currentWordIndex > 0) {
                    setLevel(prev => Math.min(prev + 1, 5));
                    setHintCount(prev => Math.min(prev + 2, 10));
                }

                // Advance to next word or fetch more if needed
                if (currentWordIndex >= gameWords.length - 1) {
                    if (allWords.length <= 20) {
                        fetchWords();
                    } else {
                        const newGameWords = allWords.slice(20).map(word => ({
                            id: word.id,
                            word: word.word.toLowerCase(),
                            meaning: word.translations?.[0]?.meaning || '',
                            translations: word.translations?.[0]?.translations?.map(t => t.word) || [],
                            difficult: word.word.length > 6
                        }));

                        setGameWords(newGameWords);
                        setCurrentWordIndex(0);
                        setAllWords(prev => prev.slice(20));
                    }
                } else {
                    setCurrentWordIndex(prev => prev + 1);
                }
            }, 1500);
        } else {
            // Lose a life
            setLives(prev => prev - 1);

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

            // Check if game over
            if (lives <= 1) {
                setTimeout(() => {
                    setGameOver(true);
                }, 1500);
            } else {
                // Clear for next attempt after delay
                setTimeout(() => {
                    setUserInput('');
                    setIsCorrect(null);
                }, 1500);
            }
        }
    };

    const revealHint = () => {
        if (hintCount <= 0) return;

        const currentWord = getCurrentWord();
        if (!currentWord) return;

        // Find a letter position that hasn't been revealed yet
        const letterPositions = Array.from({ length: currentWord.word.length }, (_, i) => i);
        const availablePositions = letterPositions.filter(pos => !revealedHints.includes(pos));

        if (availablePositions.length > 0) {
            const randomPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];
            setRevealedHints(prev => [...prev, randomPosition]);
            setHintCount(prev => prev - 1);
        }
    };

    const restartGame = () => {
        setUserInput('');
        setIsCorrect(null);
        setScore(0);
        setLives(3);
        setLevel(1);
        setGameOver(false);
        setRevealedHints([]);
        setHintCount(3);
        setCurrentWordIndex(0);
        setPlayedAudio(false);

        // Reset game words and shuffle
        if (allWords.length > 20) {
            const resetGameWords = allWords.slice(0, 20).map(word => ({
                id: word.id,
                word: word.word.toLowerCase(),
                meaning: word.translations?.[0]?.meaning || '',
                translations: word.translations?.[0]?.translations?.map(t => t.word) || [],
                difficult: word.word.length > 6
            }));

            // Sort by difficulty (shorter words first)
            resetGameWords.sort((a, b) => a.word.length - b.word.length);

            setGameWords(resetGameWords);
            setAllWords(prev => prev.slice(20));
        }
    };

    // Handle keyboard enter key
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && userInput.trim()) {
            checkAnswer();
        }
    };

    // Loading state
    if (isLoading && (allWords.length === 0 || gameWords.length === 0)) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <LoaderSpinner size="large" />
                    <p className="mt-4 text-zinc-300 dark:text-zinc-400">
                        Loading spelling bee game...
                    </p>
                </div>
            </div>
        );
    }

    // Game over screen
    if (gameOver) {
        return (
            <div className="h-full w-full flex items-center justify-center p-6">
                <motion.div
                    className="max-w-lg w-full bg-gray-900/70 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-8 shadow-xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl font-bold text-white text-center mb-6">Game Over!</h2>
                    <div className="flex justify-center mb-8">
                        <div className="bg-emerald-500/20 backdrop-blur-sm rounded-full px-8 py-4">
                            <span className="text-emerald-400 text-2xl font-bold">Final Score: {score}</span>
                        </div>
                    </div>

                    <p className="text-zinc-300 text-center mb-8">
                        You reached level {level} and spelled {currentWordIndex} words correctly!
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

    const currentWord = getCurrentWord();

    if (!currentWord) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <LoaderSpinner size="large" />
                    <p className="mt-4 text-zinc-300 dark:text-zinc-400">
                        Preparing next word...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-full w-full flex flex-col items-center justify-center p-6">
            {/* Background decorations */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-40 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '12s' }} />

            {/* Game Header */}
            <div className="w-full max-w-xl mb-8">
                <div className="flex justify-between items-center">
                    <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="bg-gray-800/70 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="text-emerald-400 font-medium">Level {level}</span>
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
                        <div className="bg-gray-800/70 backdrop-blur-sm rounded-full px-4 py-2 flex items-center">
                            {Array.from({ length: lives }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="w-4 h-4 mx-0.5 rounded-full bg-rose-500"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.1 * i, type: "spring" }}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Main Game Content */}
            <motion.div
                className="w-full max-w-xl bg-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Word Meaning */}
                <div className="mb-6 text-center">
                    <h3 className="text-zinc-300 text-sm uppercase tracking-wider mb-2">Definition</h3>
                    <p className="text-white text-xl font-medium">{currentWord.meaning}</p>

                    {currentWord.translations.length > 0 && (
                        <div className="mt-3">
                            <p className="text-zinc-400 text-sm">
                                Translations: <span className="text-cyan-400">{currentWord.translations.join(', ')}</span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Pronunciation Button */}
                <div className="flex justify-center mb-6">
                    <motion.button
                        className={clsx(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all",
                            playedAudio
                                ? "bg-gray-700/60 hover:bg-gray-700/80"
                                : "bg-indigo-600/80 hover:bg-indigo-500/80"
                        )}
                        onClick={playAudio}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                        <span>{playedAudio ? "Played" : "Hear Pronunciation"}</span>
                    </motion.button>
                </div>

                {/* Word Display with Hints */}
                <div className="mb-6">
                    <div className="flex justify-center gap-2 mb-2">
                        {currentWord.word.split('').map((letter, idx) => (
                            <motion.div
                                key={idx}
                                className={clsx(
                                    "w-10 h-12 flex items-center justify-center rounded-lg border-2 text-xl font-bold",
                                    revealedHints.includes(idx)
                                        ? "bg-emerald-500/30 border-emerald-400/50 text-white"
                                        : isCorrect === true
                                            ? "bg-emerald-500/30 border-emerald-400/50 text-white"
                                            : isCorrect === false
                                                ? "bg-rose-500/30 border-rose-400/50 text-white"
                                                : "bg-gray-800/60 border-gray-700/50 text-transparent"
                                )}
                                initial={{ rotateY: 180, opacity: 0 }}
                                animate={{
                                    rotateY: 0,
                                    opacity: 1,
                                    transition: { delay: idx * 0.05 }
                                }}
                            >
                                {revealedHints.includes(idx) || isCorrect !== null ? letter : "_"}
                            </motion.div>
                        ))}
                    </div>

                    {/* Hint Button */}
                    <div className="flex justify-center">
                        <motion.button
                            className={clsx(
                                "flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-all",
                                hintCount > 0
                                    ? "bg-amber-500/70 hover:bg-amber-400/80 text-white"
                                    : "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                            )}
                            onClick={revealHint}
                            disabled={hintCount <= 0}
                            whileHover={{ scale: hintCount > 0 ? 1.05 : 1 }}
                            whileTap={{ scale: hintCount > 0 ? 0.95 : 1 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                            </svg>
                            <span>Reveal Letter ({hintCount})</span>
                        </motion.button>
                    </div>
                </div>

                {/* Input Field */}
                <div className="mb-6">
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={userInput}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Type the word..."
                            className={clsx(
                                "w-full px-4 py-3 rounded-lg bg-gray-800/60 border-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all",
                                isCorrect === true
                                    ? "border-emerald-400/50 focus:ring-emerald-400/50"
                                    : isCorrect === false
                                        ? "border-rose-400/50 focus:ring-rose-400/50"
                                        : "border-gray-700/50 focus:ring-indigo-400/50"
                            )}
                            disabled={isCorrect !== null}
                        />

                        <AnimatePresence>
                            {isCorrect !== null && (
                                <motion.div
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ type: "spring", bounce: 0.5 }}
                                >
                                    {isCorrect ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Check Button */}
                <div className="flex justify-center">
                    <motion.button
                        className={clsx(
                            "px-6 py-3 rounded-lg font-medium shadow-lg transition-all",
                            userInput.trim() && isCorrect === null
                                ? "bg-emerald-500 text-white hover:bg-emerald-400"
                                : "bg-gray-700/50 text-gray-400 cursor-not-allowed"
                        )}
                        onClick={checkAnswer}
                        disabled={!userInput.trim() || isCorrect !== null}
                        whileHover={{ scale: userInput.trim() && isCorrect === null ? 1.05 : 1 }}
                        whileTap={{ scale: userInput.trim() && isCorrect === null ? 0.95 : 1 }}
                    >
                        Check Spelling
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};
