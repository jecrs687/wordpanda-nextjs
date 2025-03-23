'use client';

import { memoryGameAction } from '@backend/domain/actions/Games/memory.action';
import { getWords } from '@backend/domain/actions/Word/getWords.action';
import { motion } from 'framer-motion';
import { Award, CheckCircle, Clock, HelpCircle, RefreshCw, XCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { WordWithTranslationsAndUserWords } from 'src/app/api/words/route';
import Badge from '../../../_components/Badge';
import ConfettiEffect from '../../../_components/ConfettiEffect';
import GameButton from '../../../_components/GameButton';
import ProgressBar from '../../../_components/ProgressBar';
import { LoadingGames } from '../../../_container/Loading';
import QuizOption from '../../_components/QuizOption';

type QuizQuestion = {
    id: string;
    word: string;
    correctAnswer: string;
    options: string[];
    answered: boolean;
    isCorrect: boolean;
};

type GameState = 'loading' | 'ready' | 'playing' | 'reviewing' | 'completed';

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
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [gameState, setGameState] = useState<GameState>('loading');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [fetchIndex, setFetchIndex] = useState(0);
    const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);

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
                    word.translations[0].meaning
                );

                setAllWords(prev => [...prev, ...filteredWords]);
                setFetchIndex(prev => prev + 30);
            }

            if (gameState === 'loading') {
                setGameState('ready');
            }
        } catch (error) {
            console.error("Error fetching words:", error);
        }
    }, [mediaId, words, fetchIndex, lang, gameState]);

    // Initialize
    useEffect(() => {
        if (allWords.length === 0) {
            fetchWords();
        } else if (gameState === 'loading') {
            setGameState('ready');
        }
    }, [allWords.length, fetchWords, gameState]);

    // Prepare quiz
    const prepareQuiz = useCallback(() => {
        if (allWords.length < 15) {
            fetchWords();
            return;
        }

        // We need at least 15 words with definitions
        const quizWords = [...allWords].sort(() => Math.random() - 0.5).slice(0, 10);
        const otherWords = [...allWords].sort(() => Math.random() - 0.5).slice(10, 40);

        // Create questions
        const quizQuestions: QuizQuestion[] = quizWords.map(word => {
            // Get 3 incorrect options from other words
            const incorrectOptions = otherWords
                .filter(w => w.id !== word.id && w.translations?.[0]?.meaning)
                .slice(0, 3)
                .map(w => w.translations[0].meaning);

            // Add correct answer
            const correctAnswer = word.translations[0].meaning;

            // Create and shuffle options
            const options = [...incorrectOptions, correctAnswer]
                .sort(() => Math.random() - 0.5);

            return {
                id: word.id,
                word: word.word,
                correctAnswer,
                options,
                answered: false,
                isCorrect: false
            };
        });

        setQuestions(quizQuestions);
        setCurrentIndex(0);
        setScore(0);
        setTimeLeft(180);
        setSelectedOption(null);
        setGameState('playing');
        setConsecutiveCorrect(0);

        // Remove used words
        setAllWords(prev => prev.filter(word =>
            !quizWords.some(qw => qw.id === word.id)
        ));
    }, [allWords, fetchWords]);

    // Game timer
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (gameState === 'playing') {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        // Auto-submit if time runs out
                        setGameState('reviewing');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [gameState]);

    // Handle option selection
    const handleOptionSelect = (option: string) => {
        if (gameState !== 'playing' || questions[currentIndex].answered) return;
        setSelectedOption(option);
    };

    // Submit answer
    const handleSubmitAnswer = async () => {
        if (!selectedOption || questions[currentIndex].answered) return;

        const currentQuestion = questions[currentIndex];
        const isCorrect = selectedOption === currentQuestion.correctAnswer;

        // Record result
        try {
            await memoryGameAction({
                wordId: currentQuestion.id,
                hard: !isCorrect,
                mediaId
            });
        } catch (error) {
            console.error("Error recording quiz result:", error);
        }

        // Update question state
        setQuestions(prev =>
            prev.map((q, idx) =>
                idx === currentIndex
                    ? { ...q, answered: true, isCorrect }
                    : q
            )
        );

        // Update score and streak
        if (isCorrect) {
            const pointsPerQuestion = 10;
            const timeBonus = Math.round(timeLeft / 60 * 5); // Up to 5 points time bonus
            const streakBonus = Math.min(consecutiveCorrect * 2, 10); // Cap at 10 bonus points

            const totalPoints = pointsPerQuestion + timeBonus + streakBonus;
            setScore(prev => prev + totalPoints);
            setConsecutiveCorrect(prev => prev + 1);

            // Show confetti for correct answer
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 1500);
        } else {
            setConsecutiveCorrect(0);
        }

        // Move to next question after a short delay
        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setSelectedOption(null);
            } else {
                setGameState('completed');
            }
        }, 1500);
    };

    // Skip to next question
    const handleSkipQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
        }
    };

    // Format time as mm:ss
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Calculate results
    const calculateResults = () => {
        const totalQuestions = questions.length;
        const answeredQuestions = questions.filter(q => q.answered).length;
        const correctAnswers = questions.filter(q => q.isCorrect).length;

        return {
            total: totalQuestions,
            answered: answeredQuestions,
            correct: correctAnswers,
            accuracy: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
        };
    };

    // Restart quiz
    const handleRestart = () => {
        prepareQuiz();
    };

    // Loading state
    if (gameState === 'loading') {
        return <LoadingGames />;
    }

    // Start screen
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
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Vocabulary Quiz</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            Test your vocabulary knowledge with a 10-question quiz. Select the correct definition for each word.
                        </p>
                    </div>

                    <div className="bg-gray-100/80 dark:bg-gray-700/80 rounded-xl p-4 mb-6">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">How to Play:</h3>
                        <ul className="text-gray-600 dark:text-gray-300 space-y-1 text-sm">
                            <li>• You'll see a word and four possible definitions</li>
                            <li>• Select the correct definition for each word</li>
                            <li>• Earn points for each correct answer</li>
                            <li>• Bonus points for fast answers and streaks</li>
                            <li>• Try to complete all 10 questions before time runs out</li>
                        </ul>
                    </div>

                    <div className="flex justify-center">
                        <GameButton
                            onClick={prepareQuiz}
                            variant="primary"
                            size="lg"
                            icon={<HelpCircle className="h-5 w-5" />}
                        >
                            Start Quiz
                        </GameButton>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Completed screen
    if (gameState === 'completed') {
        const results = calculateResults();

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
                            <Award className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
                        Quiz Completed!
                    </h2>

                    <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                        {results.accuracy >= 80
                            ? 'Excellent work! Your vocabulary is impressive.'
                            : results.accuracy >= 50
                                ? 'Good job! Keep practicing to improve your vocabulary.'
                                : 'Keep learning! Your vocabulary will improve with practice.'}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-100/80 dark:bg-gray-800/80 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Score</p>
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{score}</p>
                        </div>

                        <div className="bg-gray-100/80 dark:bg-gray-800/80 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Accuracy</p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{results.accuracy}%</p>
                        </div>

                        <div className="bg-gray-100/80 dark:bg-gray-800/80 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Correct Answers</p>
                            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{results.correct}/{results.total}</p>
                        </div>

                        <div className="bg-gray-100/80 dark:bg-gray-800/80 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Time Used</p>
                            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{formatTime(180 - timeLeft)}</p>
                        </div>
                    </div>

                    <GameButton
                        onClick={handleRestart}
                        variant="primary"
                        size="lg"
                        fullWidth
                        icon={<RefreshCw className="h-5 w-5" />}
                    >
                        Take Another Quiz
                    </GameButton>
                </motion.div>
            </div>
        );
    }

    // Playing state
    const currentQuestion = questions[currentIndex];

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Confetti effect for correct answers */}
            <ConfettiEffect active={showConfetti} pieces={50} />

            {/* Game header stats */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <Badge variant="success" size="md">
                        Score: {score}
                    </Badge>

                    {consecutiveCorrect > 1 && (
                        <Badge
                            variant="warning"
                            size="md"
                            pulse
                        >
                            Streak: {consecutiveCorrect}
                        </Badge>
                    )}
                </div>

                <Badge
                    variant={timeLeft < 30 ? "danger" : "info"}
                    size="md"
                    icon={<Clock className="h-4 w-4" />}
                    pulse={timeLeft < 30}
                >
                    {formatTime(timeLeft)}
                </Badge>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Question {currentIndex + 1} of {questions.length}</span>
                    <span>{calculateResults().correct} correct</span>
                </div>
                <ProgressBar
                    value={currentIndex}
                    max={questions.length - 1}
                    height="md"
                />
            </div>

            {/* Question */}
            <motion.div
                key={`question-${currentIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 shadow-lg mb-4"
            >
                <h3 className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">What is the meaning of:</h3>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">{currentQuestion.word}</h2>

                <div className="space-y-3 mb-4">
                    {currentQuestion.options.map((option, idx) => (
                        <QuizOption
                            key={idx}
                            option={option}
                            index={idx}
                            selected={selectedOption === option}
                            correct={currentQuestion.answered ? option === currentQuestion.correctAnswer : undefined}
                            incorrect={currentQuestion.answered && selectedOption === option && option !== currentQuestion.correctAnswer}
                            onClick={() => handleOptionSelect(option)}
                            disabled={currentQuestion.answered}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Controls */}
            <div className="flex justify-center gap-3">
                {!currentQuestion.answered ? (
                    <>
                        <GameButton
                            onClick={handleSkipQuestion}
                            variant="outline"
                            size="md"
                            disabled={currentIndex === questions.length - 1}
                        >
                            Skip
                        </GameButton>

                        <GameButton
                            onClick={handleSubmitAnswer}
                            variant="primary"
                            size="md"
                            disabled={!selectedOption}
                        >
                            Submit Answer
                        </GameButton>
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 p-3 rounded-lg bg-gray-100/80 dark:bg-gray-700/80"
                    >
                        {currentQuestion.isCorrect ? (
                            <>
                                <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                                <span className="text-emerald-600 dark:text-emerald-300 font-medium">Correct!</span>
                            </>
                        ) : (
                            <>
                                <XCircle className="h-5 w-5 text-rose-500 dark:text-rose-400" />
                                <span className="text-rose-600 dark:text-rose-300 font-medium">Incorrect!</span>
                            </>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};
