'use client';
import { memoryGameAction } from '@backend/domain/actions/Games/memory.action';
import { getWords } from '@backend/domain/actions/Word/getWords.action';
import LoaderSpinner from '@core/LoaderSpinner';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { WordWithTranslationsAndUserWords } from 'src/app/api/words/route';

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
        }
    }, [allWords, cards]);

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

    // Reset and restart
    const restartSession = () => {
        setStudiedCount(0);
        setCurrentIndex(0);
        setStack('learning');
        setReviewStack([]);
        setShowNoMoreCards(false);

        if (allWords.length < 20) {
            fetchWords();
        }
    };

    // Loading state
    if (isLoading && cards.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <LoaderSpinner size="large" />
                    <p className="mt-4 text-zinc-300 dark:text-zinc-400">
                        Loading flashcards...
                    </p>
                </div>
            </div>
        );
    }

    // No more cards state
    if (showNoMoreCards) {
        return (
            <div className="h-full w-full flex items-center justify-center p-6">
                <motion.div
                    className="max-w-lg w-full bg-gray-900/70 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-8 shadow-xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl font-bold text-white text-center mb-6">Session Complete!</h2>
                    <div className="flex justify-center mb-8">
                        <div className="bg-emerald-500/20 backdrop-blur-sm rounded-full px-8 py-4">
                            <span className="text-emerald-400 text-2xl font-bold">Cards Studied: {studiedCount}</span>
                        </div>
                    </div>

                    <p className="text-zinc-300 text-center mb-8">
                        You've gone through all available flashcards. Great job!
                    </p>

                    <div className="flex justify-center">
                        <motion.button
                            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-medium rounded-lg shadow-lg"
                            onClick={restartSession}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Start New Session
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // No cards available
    if (cards.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <p className="text-zinc-300">No flashcards available.</p>
                </div>
            </div>
        );
    }

    const currentCard = cards[currentIndex];

    return (
        <div className="relative h-full w-full flex flex-col items-center justify-center p-6">
            {/* Background decorations */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-40 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '12s' }} />

            {/* Session info */}
            <div className="w-full max-w-xl mb-6 flex justify-between items-center">
                <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-gray-800/70 backdrop-blur-sm rounded-full px-4 py-2">
                        <span className="text-white font-medium">Card <span className="text-emerald-400">{currentIndex + 1}/{cards.length}</span></span>
                    </div>
                </motion.div>

                <motion.div
                    className="bg-gray-800/70 backdrop-blur-sm rounded-full px-4 py-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="text-white font-medium">Stack: <span className={stack === 'learning' ? "text-indigo-400" : "text-amber-400"}>
                        {stack === 'learning' ? 'Learning' : 'Review'}
                    </span></span>
                </motion.div>
            </div>

            {/* Flashcard */}
            <div className="w-full max-w-xl mb-6 perspective-1000">
                <motion.div
                    className="w-full h-64 md:h-80 cursor-pointer"
                    onClick={flipCard}
                    initial={{ rotateY: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <motion.div
                        className="w-full h-full relative transform-style-3d transition-all duration-500"
                        animate={{ rotateY: currentCard.isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Front side (word) */}
                        <div className="absolute inset-0 backface-hidden bg-gray-900/60 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6 flex flex-col items-center justify-center shadow-xl">
                            <motion.h2
                                className="text-4xl font-bold text-white mb-4 text-center"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                {currentCard.word}
                            </motion.h2>

                            {currentCard.translations.length > 0 && (
                                <motion.div
                                    className="mt-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <span className="text-zinc-400 text-sm">Related translations: </span>
                                    <div className="flex flex-wrap justify-center gap-2 mt-1">
                                        {currentCard.translations.slice(0, 3).map((translation, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-indigo-500/30 rounded-md text-indigo-300 text-sm">
                                                {translation}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            <motion.p
                                className="text-zinc-300 mt-6 text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.8 }}
                                transition={{ delay: 0.4 }}
                            >
                                Click to flip and see the definition
                            </motion.p>
                        </div>

                        {/* Back side (meaning) */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gray-900/60 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6 flex flex-col shadow-xl overflow-y-auto">
                            <h3 className="text-zinc-300 text-sm uppercase tracking-wider mb-2">Definition</h3>
                            <p className="text-white text-xl font-medium mb-4">{currentCard.meaning}</p>

                            {currentCard.examples.length > 0 && (
                                <div className="mt-2">
                                    <h3 className="text-zinc-300 text-sm uppercase tracking-wider mb-2">Examples</h3>
                                    <ul className="space-y-2">
                                        {currentCard.examples.slice(0, 2).map((example, idx) => (
                                            <li key={idx} className="text-zinc-300 italic bg-gray-800/30 p-2 rounded-md">
                                                "{example}"
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <p className="text-zinc-400 mt-auto text-center text-sm">
                                Click to flip back
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Controls */}
            <div className="w-full max-w-xl">
                <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 shadow-lg">
                    <p className="text-center text-zinc-300 mb-4">How well did you know this word?</p>

                    <div className="flex justify-center gap-3">
                        <motion.button
                            className="px-5 py-2 bg-rose-500/80 text-white font-medium rounded-lg shadow-md hover:bg-rose-400/80 transition-all"
                            onClick={() => rateCard('hard')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Hard
                        </motion.button>

                        <motion.button
                            className="px-5 py-2 bg-amber-500/80 text-white font-medium rounded-lg shadow-md hover:bg-amber-400/80 transition-all"
                            onClick={() => rateCard('medium')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Medium
                        </motion.button>

                        <motion.button
                            className="px-5 py-2 bg-emerald-500/80 text-white font-medium rounded-lg shadow-md hover:bg-emerald-400/80 transition-all"
                            onClick={() => rateCard('easy')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Easy
                        </motion.button>
                    </div>

                    <div className="flex justify-center mt-4">
                        <motion.button
                            className="px-4 py-1 bg-gray-700/60 text-zinc-300 text-sm rounded-full shadow-md hover:bg-gray-600/60 transition-all"
                            onClick={skipCard}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Skip
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-xl mt-6">
                <div className="h-1 bg-gray-800/70 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-emerald-500"
                        initial={{ width: '0%' }}
                        animate={{ width: `${(currentIndex / cards.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>
        </div>
    );
};
