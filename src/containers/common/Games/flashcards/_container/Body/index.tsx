'use client';
import { memoryGameAction } from '@backend/domain/actions/Games/memory.action';
import { getWords } from '@backend/domain/actions/Word/getWords.action';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, ChevronLeft, ChevronRight, Frown, Meh, PawPrint, RefreshCw, Smile } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { WordWithTranslationsAndUserWords } from 'src/app/api/words/route';
import GameButton from '../../../_components/GameButton';
import { LoadingGames } from '../../../_container/Loading';

type FlashCard = {
    id: string;
    word: string;
    meaning: string;
    examples: string[];
    translations: string[];
    isFlipped: boolean;
    difficulty: 'easy' | 'medium' | 'hard';
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
    const [cards, setCards] = useState<FlashCard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [studiedCount, setStudiedCount] = useState(0);
    const [stack, setStack] = useState<'learning' | 'review'>('learning');
    const [reviewStack, setReviewStack] = useState<FlashCard[]>([]);
    const [dataIndex, setDataIndex] = useState(0);
    const [showNoMoreCards, setShowNoMoreCards] = useState(false);
    const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
    const [streak, setStreak] = useState(0);

    // Fetch words
    const fetchWords = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getWords({
                language: lang,
                ...(mediaId ? { mediaId } : { words: words.slice(dataIndex, dataIndex + 20).map(x => x.word) }),
                limit: 20
            });

            if (response?.data?.words) {
                const filteredWords = response.data.words.filter(word =>
                    word.translations &&
                    word.translations.length > 0 &&
                    word.translations[0].meaning
                );

                setAllWords(prev => [...prev, ...filteredWords]);
                setDataIndex(prev => prev + 20);
            }
        } catch (error) {
            console.error("Error fetching words:", error);
        } finally {
            setIsLoading(false);
        }
    }, [mediaId, words, dataIndex, lang]);

    // Prepare cards
    useEffect(() => {
        if (allWords.length > 0 && cards.length === 0) {
            const newCards = allWords.slice(0, 20).map(word => ({
                id: word.id,
                word: word.word,
                meaning: word.translations?.[0]?.meaning || 'No meaning available',
                examples: [], // Placeholder since 'examples' is not part of the type
                translations: word.translations?.[0]?.translations?.map(t => t.word) || [],
                isFlipped: false,
                difficulty: 'medium' as const
            }));

            setCards(newCards);
            setAllWords(prev => prev.slice(20));

            // Start session timer
            if (!sessionStartTime) {
                setSessionStartTime(new Date());
            }
        }
    }, [allWords, cards, sessionStartTime]);

    // Initialize
    useEffect(() => {
        if (allWords.length === 0) {
            fetchWords();
        }
    }, [allWords.length, fetchWords]);

    // Handle card flipping
    const flipCard = () => {
        if (cards.length === 0) return;

        setCards(prev =>
            prev.map((card, idx) =>
                idx === currentIndex ? { ...card, isFlipped: !card.isFlipped } : card
            )
        );
    };

    // Rate card difficulty and move to next
    const rateCard = async (difficulty: 'easy' | 'medium' | 'hard') => {
        if (cards.length === 0 || currentIndex >= cards.length) return;

        const currentCard = cards[currentIndex];

        // Record progress
        try {
            await memoryGameAction({
                wordId: currentCard.id,
                hard: difficulty === 'hard',
                mediaId
            });
        } catch (error) {
            console.error("Error recording card progress:", error);
        }

        // Update card with difficulty rating
        const updatedCards = [...cards];
        updatedCards[currentIndex] = { ...currentCard, difficulty, isFlipped: false };

        // If card was difficult, add to review stack
        if (difficulty === 'hard' || difficulty === 'medium') {
            setReviewStack(prev => [...prev, { ...currentCard, difficulty, isFlipped: false }]);
        }

        // Update streak
        if (difficulty === 'easy') {
            setStreak(prev => prev + 1);
        } else if (difficulty === 'hard') {
            setStreak(0);
        }

        // Move to next card
        const nextIndex = currentIndex + 1;

        // Check if we've reached the end of the current stack
        if (nextIndex >= cards.length) {
            // If we're in learning mode and have review cards, switch to review
            if (stack === 'learning' && reviewStack.length > 0) {
                setStack('review');
                setCards(reviewStack);
                setReviewStack([]);
                setCurrentIndex(0);
            }
            // If we're already in review mode or have no review cards
            else {
                // Check if we have more words to fetch
                if (allWords.length < 10) {
                    fetchWords();
                }

                // If we have more words in allWords, prepare next batch
                if (allWords.length > 0) {
                    const newBatch = allWords.slice(0, 20).map(word => ({
                        id: word.id,
                        word: word.word,
                        meaning: word.translations?.[0]?.meaning || 'No meaning available',
                        examples: [],
                        translations: word.translations?.[0]?.translations?.map(t => t.word) || [],
                        isFlipped: false,
                        difficulty: 'medium' as const
                    }));

                    setCards(newBatch);
                    setAllWords(prev => prev.slice(20));
                    setCurrentIndex(0);
                    setStack('learning');
                } else {
                    // No more cards
                    setCards([]);
                    setShowNoMoreCards(true);
                }
            }
        } else {
            // Just move to next card in current stack
            setCurrentIndex(nextIndex);
        }

        // Increment studied count
        setStudiedCount(prev => prev + 1);
    };

    // Skip to next card without rating
    const skipCard = () => {
        if (cards.length === 0 || currentIndex >= cards.length) return;

        // Reset current card flip state
        const updatedCards = [...cards];
        updatedCards[currentIndex] = { ...updatedCards[currentIndex], isFlipped: false };
        setCards(updatedCards);

        // Move to next card
        const nextIndex = currentIndex + 1;

        if (nextIndex >= cards.length) {
            if (stack === 'learning' && reviewStack.length > 0) {
                setStack('review');
                setCards(reviewStack);
                setReviewStack([]);
                setCurrentIndex(0);
            } else if (allWords.length > 0) {
                const newBatch = allWords.slice(0, 20).map(word => ({
                    id: word.id,
                    word: word.word,
                    meaning: word.translations?.[0]?.meaning || 'No meaning available',
                    examples: [],
                    translations: word.translations?.[0]?.translations?.map(t => t.word) || [],
                    isFlipped: false,
                    difficulty: 'medium' as const
                }));

                setCards(newBatch);
                setAllWords(prev => prev.slice(20));
                setCurrentIndex(0);
                setStack('learning');
            } else {
                setCards([]);
                setShowNoMoreCards(true);
            }
        } else {
            setCurrentIndex(nextIndex);
        }
    };

    // Navigate to previous card
    const goToPreviousCard = () => {
        if (currentIndex > 0) {
            // Ensure card is flipped back to front
            const updatedCards = [...cards];
            updatedCards[currentIndex] = { ...updatedCards[currentIndex], isFlipped: false };
            setCards(updatedCards);

            setCurrentIndex(prev => prev - 1);
        }
    };

    // Navigate to next card
    const goToNextCard = () => {
        if (currentIndex < cards.length - 1) {
            // Ensure card is flipped back to front
            const updatedCards = [...cards];
            updatedCards[currentIndex] = { ...updatedCards[currentIndex], isFlipped: false };
            setCards(updatedCards);

            setCurrentIndex(prev => prev + 1);
        }
    };

    // Reset and restart
    const restartSession = () => {
        setStudiedCount(0);
        setCurrentIndex(0);
        setStack('learning');
        setReviewStack([]);
        setShowNoMoreCards(false);
        setSessionStartTime(new Date());
        setStreak(0);

        if (allWords.length < 20) {
            fetchWords();
        }
    };

    // Calculate session duration
    const getSessionDuration = () => {
        if (!sessionStartTime) return "0 minutes";

        const minutes = Math.round((new Date().getTime() - sessionStartTime.getTime()) / 60000);
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    };

    // Loading state
    if (isLoading && cards.length === 0) return <LoadingGames />

    // No more cards state
    if (showNoMoreCards) {
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

                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-6">Session Complete!</h2>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-gray-100/80 dark:bg-gray-800/80 rounded-xl p-4 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Cards Studied</p>
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{studiedCount}</p>
                        </div>
                        <div className="bg-gray-100/80 dark:bg-gray-800/80 rounded-xl p-4 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Session Duration</p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{getSessionDuration()}</p>
                        </div>
                        <div className="bg-gray-100/80 dark:bg-gray-800/80 rounded-xl p-4 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Best Streak</p>
                            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{streak}</p>
                        </div>
                        <div className="bg-gray-100/80 dark:bg-gray-800/80 rounded-xl p-4 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Completion</p>
                            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">100%</p>
                        </div>
                    </div>

                    <GameButton
                        onClick={restartSession}
                        variant="primary"
                        size="lg"
                        fullWidth
                        icon={<RefreshCw className="h-5 w-5" />}
                    >
                        Start New Session
                    </GameButton>
                </motion.div>
            </div>
        );
    }

    // No cards available
    if (cards.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <div className="flex flex-col items-center bg-white/80 dark:bg-gray-800/80 p-8 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                    <PawPrint className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                    <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">No flashcards available.</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Try selecting a different language or adding new words.</p>
                </div>
            </div>
        );
    }

    const currentCard = cards[currentIndex];

    return (
        <div className="relative h-full w-full flex flex-col items-center justify-center p-4 sm:p-6">
            {/* Session info */}
            <div className="w-full max-w-xl mb-4 sm:mb-6 flex flex-wrap justify-between items-center gap-3">
                <motion.div
                    className="flex flex-wrap items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-3 py-1.5 border border-gray-200/50 dark:border-gray-700/50">
                        <span className="text-gray-700 dark:text-gray-300 font-medium flex items-center">
                            Card {currentIndex + 1} of {cards.length}
                        </span>
                    </div>

                    {streak > 0 && (
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-3 py-1.5 border border-gray-200/50 dark:border-gray-700/50">
                            <span className="text-amber-600 dark:text-amber-400 font-medium">
                                Streak: {streak}
                            </span>
                        </div>
                    )}
                </motion.div>

                <motion.div
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-3 py-1.5 border border-gray-200/50 dark:border-gray-700/50"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className={`font-medium flex items-center ${stack === 'learning'
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-amber-600 dark:text-amber-400"
                        }`}>
                        <PawPrint className="h-3.5 w-3.5 mr-1" />
                        {stack === 'learning' ? 'Learning' : 'Review'}
                    </span>
                </motion.div>
            </div>

            {/* Flashcard */}
            <div className="w-full max-w-xl mb-6 perspective-1000">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        className="w-full h-64 md:h-80 cursor-pointer"
                        onClick={flipCard}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className="w-full h-full relative transform-style-3d transition-all duration-500"
                            animate={{ rotateY: currentCard.isFlipped ? 180 : 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Front of card - Word */}
                            <div className={`absolute inset-0 backface-hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col ${currentCard.isFlipped ? 'opacity-0' : 'opacity-100'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        Tap to flip
                                    </span>
                                    <span className={`px-2 py-0.5 text-xs rounded-full 
                                        ${currentCard.difficulty === 'easy'
                                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                                            : currentCard.difficulty === 'medium'
                                                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                                                : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300'}`}>
                                        {currentCard.difficulty}
                                    </span>
                                </div>
                                <div className="flex-grow flex flex-col items-center justify-center">
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                        {currentCard.word}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300 text-center mt-2">
                                        {currentCard.meaning}
                                    </p>
                                </div>
                            </div>

                            {/* Back of card - Translation and examples */}
                            <div className={`absolute inset-0 backface-hidden bg-indigo-50 dark:bg-indigo-900/20 rounded-xl shadow-lg border border-indigo-200 dark:border-indigo-800/50 p-6 flex flex-col rotate-y-180 ${currentCard.isFlipped ? 'opacity-100' : 'opacity-0'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-xs text-indigo-600 dark:text-indigo-300">
                                        Tap to flip back
                                    </span>
                                </div>
                                <div className="flex-grow flex flex-col justify-center">
                                    <h3 className="text-sm uppercase tracking-wide text-indigo-600 dark:text-indigo-300 mb-2">
                                        Translations:
                                    </h3>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {currentCard.translations.length > 0 ? (
                                            currentCard.translations.map((translation, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-white dark:bg-gray-800 rounded-md text-gray-800 dark:text-gray-200 text-sm">
                                                    {translation}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-500 dark:text-gray-400">
                                                No translations available
                                            </span>
                                        )}
                                    </div>

                                    {currentCard.examples.length > 0 && (
                                        <>
                                            <h3 className="text-sm uppercase tracking-wide text-indigo-600 dark:text-indigo-300 mb-2">
                                                Examples:
                                            </h3>
                                            <ul className="space-y-2">
                                                {currentCard.examples.map((example, idx) => (
                                                    <li key={idx} className="text-gray-700 dark:text-gray-300 text-sm">
                                                        • {example}
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation controls */}
            <div className="w-full max-w-xl flex items-center justify-between mb-6">
                <GameButton
                    onClick={goToPreviousCard}
                    variant="outline"
                    size="sm"
                    icon={<ChevronLeft className="h-4 w-4" />}
                    disabled={currentIndex === 0}
                >
                    Previous
                </GameButton>

                <div className="flex-1 flex justify-center">
                    <motion.div
                        className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full max-w-[50%] overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <motion.div
                            className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </motion.div>
                </div>

                <GameButton
                    onClick={goToNextCard}
                    variant="outline"
                    size="sm"
                    icon={<ChevronRight className="h-4 w-4" />}
                    disabled={currentIndex === cards.length - 1}
                >
                    Next
                </GameButton>
            </div>

            {/* Controls */}
            <div className="w-full max-w-xl">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-4 shadow-lg">
                    <p className="text-center text-gray-700 dark:text-gray-300 mb-4 font-medium">How well did you know this word?</p>

                    <div className="grid grid-cols-3 gap-3">
                        <GameButton
                            onClick={() => rateCard('hard')}
                            variant="ghost"
                            size="md"
                            className="flex-col bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-300 hover:text-rose-700 dark:hover:text-rose-200"
                        >
                            <Frown className="h-6 w-6 mb-1" />
                            Hard
                        </GameButton>

                        <GameButton
                            onClick={() => rateCard('medium')}
                            variant="ghost"
                            size="md"
                            className="flex-col bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-600 dark:text-amber-300 hover:text-amber-700 dark:hover:text-amber-200"
                        >
                            <Meh className="h-6 w-6 mb-1" />
                            Medium
                        </GameButton>

                        <GameButton
                            onClick={() => rateCard('easy')}
                            variant="ghost"
                            size="md"
                            className="flex-col bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 hover:text-emerald-700 dark:hover:text-emerald-200"
                        >
                            <Smile className="h-6 w-6 mb-1" />
                            Easy
                        </GameButton>
                    </div>

                    <div className="flex justify-center mt-4">
                        <GameButton
                            onClick={skipCard}
                            variant="ghost"
                            size="sm"
                            icon={<ChevronRight className="h-4 w-4" />}
                            className="text-gray-500 dark:text-gray-400"
                        >
                            Skip
                        </GameButton>
                    </div>
                </div>
            </div>

            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-400/5 dark:bg-emerald-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-40 right-10 w-96 h-96 bg-indigo-400/5 dark:bg-indigo-400/10 rounded-full blur-3xl" />
            </div>
        </div>
    );
};
