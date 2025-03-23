'use client';

import { memoryGameAction } from '@backend/domain/actions/Games/memory.action';
import { getWords } from '@backend/domain/actions/Word/getWords.action';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Clock, Lightbulb, RefreshCw, SkipForward, Zap } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { WordWithTranslationsAndUserWords } from 'src/app/api/words/route';
import Badge from '../../../_components/Badge';
import ConfettiEffect from '../../../_components/ConfettiEffect';
import GameButton from '../../../_components/GameButton';
import ProgressBar from '../../../_components/ProgressBar';
import { LoadingGames } from '../../../_container/Loading';
import LetterTile from '../../_components/LetterTile';

type GameWord = {
    id: string;
    original: string;
    scrambled: string;
    meaning: string;
    hint?: string;
};

type GameState = 'loading' | 'playing' | 'won' | 'lost' | 'completed';

// Scramble a word while ensuring it's different from original
const scrambleWord = (word: string): string => {
    if (word.length <= 1) return word;

    let scrambled = word;
    // Keep trying until we get a different arrangement
    while (scrambled === word) {
        scrambled = word
            .split('')
            .sort(() => Math.random() - 0.5)
            .join('');
    }
    return scrambled;
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
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [gameState, setGameState] = useState<GameState>('loading');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [streak, setStreak] = useState(0);
    const [level, setLevel] = useState(1);
    const [showHint, setShowHint] = useState(false);
    const [hintPenalty, setHintPenalty] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [fetchIndex, setFetchIndex] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);

    // Fetch words
    const fetchWords = useCallback(async () => {
        setGameState('loading');
        try {
            const response = await getWords({
                language: lang,
                ...(mediaId
                    ? { mediaId }
                    : { words: words.slice(fetchIndex, fetchIndex + 20).map(x => x.word) }),
                limit: 20
            });

            if (response?.data?.words) {
                const filteredWords = response.data.words.filter(word =>
                    word.translations?.length > 0 &&
                    word.translations[0].meaning &&
                    word.word.length >= 3 // Only use words with at least 3 letters
                );

                setAllWords(prev => [...prev, ...filteredWords]);
                setFetchIndex(prev => prev + 20);
            }

            if (gameState === 'loading') {
                prepareGame();
            }
        } catch (error) {
            console.error("Error fetching words:", error);
        }
    }, [mediaId, words, fetchIndex, lang, gameState]);

    // Prepare game
    const prepareGame = useCallback(() => {
        if (allWords.length < 10) {
            fetchWords();
            return;
        }

        // Get 10 random words for this game session
        const selectedWords = [...allWords]
            .sort(() => Math.random() - 0.5)
            .slice(0, 10)
            .map(word => ({
                id: word.id,
                original: word.word.toLowerCase(),
                scrambled: scrambleWord(word.word.toLowerCase()),
                meaning: word.translations?.[0]?.meaning || 'No meaning available',
                hint: word.translations?.[0]?.translations?.[0]?.word || undefined
            }));

        setGameWords(selectedWords);
        setCurrentIndex(0);
        setUserInput('');
        setGameState('playing');
        setScore(0);
        setTimeLeft(60);
        setStreak(0);
        setLevel(1);
        setShowHint(false);
        setHintPenalty(false);

        // Remove used words
        setAllWords(prev => prev.filter(word =>
            !selectedWords.some(selected => selected.id === word.id))
        );
    }, [allWords, fetchWords]);

    // Initialize game
    useEffect(() => {
        if (allWords.length === 0) {
            fetchWords();
        } else if (gameState === 'loading') {
            prepareGame();
        }
    }, [allWords.length, fetchWords, gameState, prepareGame]);

    // Game timer
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (gameState === 'playing') {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setGameState('lost');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [gameState]);

    // Focus input when game starts
    useEffect(() => {
        if (gameState === 'playing' && inputRef.current) {
            inputRef.current.focus();
        }
    }, [gameState, currentIndex]);

    // Handle user input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value.toLowerCase());
    };

    // Submit answer
    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (gameState !== 'playing' || !gameWords[currentIndex]) return;

        const correctWord = gameWords[currentIndex].original;
        const isCorrect = userInput.toLowerCase() === correctWord.toLowerCase();

        if (isCorrect) {
            // Calculate score
            const baseScore = 10 * level;
            const timeBonus = Math.round(timeLeft / 10);
            const streakBonus = streak * 5;
            const hintReduction = hintPenalty ? -5 : 0;

            const wordScore = baseScore + timeBonus + streakBonus + hintReduction;

            // Record success
            try {
                await memoryGameAction({
                    wordId: gameWords[currentIndex].id,
                    hard: false,
                    mediaId
                });
            } catch (error) {
                console.error("Error recording success:", error);
            }

            // Update game state
            setScore(prev => prev + wordScore);
            setStreak(prev => prev + 1);
            setShowHint(false);
            setHintPenalty(false);

            // Show confetti animation for correct answer
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 2000);

            // Move to next word
            const nextIndex = currentIndex + 1;
            if (nextIndex >= gameWords.length) {
                setGameState('completed');
            } else {
                setCurrentIndex(nextIndex);
                setUserInput('');

                // Increase level every 3 words
                if (nextIndex > 0 && nextIndex % 3 === 0) {
                    setLevel(prev => Math.min(prev + 1, 3));
                    setTimeLeft(prev => prev + 15); // Bonus time for level up
                }
            }
        } else {
            // Wrong answer - shake animation is handled by CSS
            setStreak(0);

            // Record failure
            try {
                await memoryGameAction({
                    wordId: gameWords[currentIndex].id,
                    hard: true,
                    mediaId
                });
            } catch (error) {
                console.error("Error recording failure:", error);
            }
        }
    };

    // Skip current word
    const handleSkip = () => {
        if (gameState !== 'playing' || !gameWords[currentIndex]) return;

        setStreak(0);
        setShowHint(false);
        setHintPenalty(false);

        // Record skip as failure
        try {
            memoryGameAction({
                wordId: gameWords[currentIndex].id,
                hard: true,
                mediaId
            });
        } catch (error) {
            console.error("Error recording skip:", error);
        }

        // Move to next word
        const nextIndex = currentIndex + 1;
        if (nextIndex >= gameWords.length) {
            setGameState('completed');
        } else {
            setCurrentIndex(nextIndex);
            setUserInput('');
        }
    };

    // Show hint
    const handleShowHint = () => {
        if (gameState !== 'playing' || showHint) return;

        setShowHint(true);
        setHintPenalty(true);
    };

    // Restart game
    const handleRestart = () => {
        prepareGame();
    };

    // Format time as mm:ss
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Loading state
    if (gameState === 'loading') {
        return <LoadingGames />;
    }

    // Current word
    const currentWord = gameWords[currentIndex];

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Confetti effect for correct answers */}
            <ConfettiEffect active={showConfetti} pieces={50} />

            {/* Game header stats */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <Badge
                        variant="success"
                        size="md"
                        icon={<Zap className="h-4 w-4" />}
                    >
                        Score: {score}
                    </Badge>

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
                </div>

                <div className="flex items-center gap-3">
                    <Badge
                        variant={timeLeft < 15 ? "danger" : "info"}
                        size="md"
                        icon={<Clock className="h-4 w-4" />}
                        pulse={timeLeft < 15}
                    >
                        Time: {formatTime(timeLeft)}
                    </Badge>

                    <Badge variant="primary" size="md">
                        Level {level}
                    </Badge>
                </div>
            </div>

            {/* Progress bar */}
            <div className="mb-8">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{currentIndex}/{gameWords.length} words</span>
                </div>
                <ProgressBar
                    value={currentIndex}
                    max={gameWords.length}
                    height="md"
                    showPercentage
                />
            </div>

            {/* Game content */}
            {gameState === 'playing' && currentWord && (
                <motion.div
                    key={currentWord.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 shadow-lg"
                >
                    <div className="mb-6">
                        <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1">Unscramble this word:</h3>

                        <div className="flex flex-wrap justify-center gap-2 mb-4">
                            {currentWord.scrambled.split('').map((letter, index) => (
                                <LetterTile
                                    key={index}
                                    letter={letter}
                                    isActive={true}
                                />
                            ))}
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
                            <span className="font-medium">Hint:</span> {currentWord.meaning}
                        </p>

                        {showHint && currentWord.hint && (
                            <motion.p
                                className="text-amber-600 dark:text-amber-400 text-sm mt-2 text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                Translation: {currentWord.hint}
                            </motion.p>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="mb-4">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={userInput}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
                                placeholder="Type your answer..."
                                autoComplete="off"
                                autoCapitalize="off"
                                spellCheck="false"
                            />

                            <GameButton
                                onClick={() => handleSubmit()}
                                variant="primary"
                                size="md"
                                type="submit"
                            >
                                Check
                            </GameButton>
                        </div>
                    </form>

                    <div className="flex justify-center gap-3">
                        {!showHint && (
                            <GameButton
                                onClick={handleShowHint}
                                variant="outline"
                                size="sm"
                                icon={<Lightbulb className="h-4 w-4" />}
                                disabled={!currentWord.hint}
                            >
                                Hint (-5 pts)
                            </GameButton>
                        )}

                        <GameButton
                            onClick={handleSkip}
                            variant="outline"
                            size="sm"
                            icon={<SkipForward className="h-4 w-4" />}
                        >
                            Skip
                        </GameButton>
                    </div>
                </motion.div>
            )}

            {/* Game over state */}
            {(gameState === 'lost' || gameState === 'completed') && (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 shadow-xl max-w-lg mx-auto"
                    >
                        <div className="flex justify-center mb-6">
                            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full">
                                <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
                            {gameState === 'completed' ? 'Great Job!' : 'Time\'s Up!'}
                        </h2>

                        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                            {gameState === 'completed'
                                ? 'You completed all the word scrambles!'
                                : 'You ran out of time, but keep practicing!'}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-100/80 dark:bg-gray-800/80 p-4 rounded-lg text-center">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Final Score</p>
                                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{score}</p>
                            </div>

                            <div className="bg-gray-100/80 dark:bg-gray-800/80 p-4 rounded-lg text-center">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Words Solved</p>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {currentIndex}/{gameWords.length}
                                </p>
                            </div>

                            <div className="bg-gray-100/80 dark:bg-gray-800/80 p-4 rounded-lg text-center">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Best Streak</p>
                                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{streak}</p>
                            </div>

                            <div className="bg-gray-100/80 dark:bg-gray-800/80 p-4 rounded-lg text-center">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Level Reached</p>
                                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{level}</p>
                            </div>
                        </div>

                        <GameButton
                            onClick={handleRestart}
                            variant="primary"
                            size="lg"
                            fullWidth
                            icon={<RefreshCw className="h-5 w-5" />}
                        >
                            Play Again
                        </GameButton>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
};
