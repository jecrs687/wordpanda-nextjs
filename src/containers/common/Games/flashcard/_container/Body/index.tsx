'use client';

import { WordsPostResponse, WordWithTranslationsAndUserWords } from '@/src/app/api/words/route';
import { flashGameAction } from '@/src/backend/domain/actions/Games/flash.action';
import { getWords } from '@/src/backend/domain/actions/Word/getWords.action';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useDrag } from 'react-dnd';

// Loading component with smooth animation
const Loading = () => (
    <div className="flex flex-col items-center justify-center h-[60vh]">
        <motion.div
            animate={{
                rotate: 360,
                borderRadius: ["50% 50% 50% 50%", "40% 60% 60% 40%", "50% 50% 50% 50%"],
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full"
        />
        <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">Loading cards...</p>
    </div>
);

// Card component with glass effect and animations
const FlashCard = ({
    word,
    onHard,
    onEasy,
    onSkip
}: {
    word: any;
    onHard: () => void;
    onEasy: () => void;
    onSkip: () => void;
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [isFlipped, setIsFlipped] = useState(false);
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'card',
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
            test: monitor.didDrop()
        }),
    }));

    return (
        <div className={`relative ${isDragging ? 'opacity-50' : 'opacity-100'}`}>
            <motion.div
                ref={(node) => {
                    if (node) drag(node);
                }}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer"
            >
                <div className="perspective-1000 relative w-full max-w-md mx-auto" style={{ perspective: "1000px" }}>
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={isFlipped ? 'back' : 'front'}
                            initial={{ rotateY: isFlipped ? 180 : 0 }}
                            animate={{ rotateY: isFlipped ? 0 : 0 }}
                            exit={{ rotateY: isFlipped ? 0 : -180 }}
                            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                            onClick={() => setIsFlipped(!isFlipped)}
                            className={`relative w-full h-[350px] md:h-[400px] rounded-2xl overflow-hidden`}
                            style={{
                                transformStyle: 'preserve-3d',
                                backfaceVisibility: 'hidden'
                            }}
                        >
                            <div className={`absolute inset-0 p-8 flex flex-col justify-center items-center h-full w-full
                                ${!isFlipped ? 'z-10' : 'z-0 rotateY-180'}
                                ${isDark
                                    ? 'bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-md border border-gray-800/50'
                                    : 'bg-gradient-to-br from-white/90 to-zinc-100/80 backdrop-blur-md border border-gray-200/50 shadow-lg'
                                }`}
                                style={{
                                    backfaceVisibility: 'hidden',
                                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                                }}
                            >
                                <div className="absolute top-4 left-4">
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium
                                        ${isDark ? 'bg-gray-800 text-emerald-400' : 'bg-gray-100 text-emerald-600'}`}>
                                        Word
                                    </div>
                                </div>

                                <motion.h2
                                    className="text-4xl font-bold mb-3 text-center"
                                    animate={{ scale: [0.95, 1], opacity: [0.8, 1] }}
                                    transition={{ duration: 0.4 }}
                                >
                                    {word?.word || 'No word'}
                                </motion.h2>

                                {word?.phonetic && (
                                    <p className={`text-base font-medium mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {word.phonetic}
                                    </p>
                                )}

                                {word?.example && (
                                    <div className={`mt-6 p-4 rounded-xl ${isDark
                                        ? 'bg-gray-800/50 border border-gray-700/30'
                                        : 'bg-gray-100/80 border border-gray-200/30'}`}
                                    >
                                        <p className="italic text-sm">&quot;{word.example}&quot;</p>
                                    </div>
                                )}
                            </div>

                            <div className={`absolute inset-0 p-8 flex flex-col justify-center items-center h-full w-full
                                ${isFlipped ? 'z-10' : 'z-0 rotateY-180'}
                                ${isDark
                                    ? 'bg-gradient-to-br from-gray-900/80 via-blue-950/10 to-gray-800/80 backdrop-blur-md border border-gray-800/50'
                                    : 'bg-gradient-to-br from-white/90 via-sky-50/30 to-zinc-100/80 backdrop-blur-md border border-gray-200/50 shadow-lg'
                                }`}
                                style={{
                                    backfaceVisibility: 'hidden',
                                    transform: !isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                                }}
                            >
                                <div className="absolute top-4 left-4">
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium
                                        ${isDark ? 'bg-gray-800 text-indigo-400' : 'bg-gray-100 text-indigo-600'}`}>
                                        Translation
                                    </div>
                                </div>

                                <motion.h2
                                    className="text-4xl font-bold mb-3 text-center"
                                    animate={{ scale: [0.95, 1], opacity: [0.8, 1] }}
                                    transition={{ duration: 0.4 }}
                                >
                                    {word?.translations?.[0]?.text || 'No translation'}
                                </motion.h2>

                                {word?.translations?.[0]?.example && (
                                    <div className={`mt-6 p-4 rounded-xl ${isDark
                                        ? 'bg-gray-800/50 border border-gray-700/30'
                                        : 'bg-gray-100/80 border border-gray-200/30'}`}
                                    >
                                        <p className="italic text-sm">&quot;{word.translations[0].example}&quot;</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Swipeable hint overlay */}
            <div className={`absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none opacity-0 transition-opacity duration-300 ${isDragging ? 'opacity-70' : ''}`}>
                <div className={`p-6 rounded-r-full ${isDark ? 'bg-rose-500/20' : 'bg-rose-500/10'}`}>
                    <span className="text-2xl font-bold text-rose-500">Hard</span>
                </div>
                <div className={`p-6 rounded-l-full ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-500/10'}`}>
                    <span className="text-2xl font-bold text-emerald-500">Easy</span>
                </div>
            </div>

            {/* Controls */}
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-md mx-auto">
                <motion.button
                    onClick={onHard}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05, boxShadow: `0 0 20px rgba(239, 68, 68, 0.4)` }}
                    className="py-4 px-3 rounded-xl font-semibold bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg"
                >
                    Hard
                </motion.button>

                <motion.button
                    onClick={onSkip}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05, boxShadow: `0 0 20px rgba(79, 70, 229, 0.4)` }}
                    className="py-4 px-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg"
                >
                    Skip
                </motion.button>

                <motion.button
                    onClick={onEasy}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05, boxShadow: `0 0 20px rgba(16, 185, 129, 0.4)` }}
                    className="py-4 px-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                >
                    Easy
                </motion.button>
            </div>
        </div>
    );
};

// Progress indicator with animation
const ProgressIndicator = ({ current, total }: { current: number, total: number }) => {
    const progress = Math.min(100, Math.max(0, (current / total) * 100));
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="w-full max-w-md mx-auto mb-6">
            <div className="flex justify-between mb-1">
                <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Progress
                </span>
                <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {current}/{total}
                </span>
            </div>
            <div className={`h-2 w-full rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                <motion.div
                    className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
        </div>
    );
};

// Empty state component
const EmptyState = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-12 text-center max-w-md mx-auto ${isDark
                ? 'bg-gray-900/80 backdrop-blur-md border border-gray-800/50'
                : 'bg-white/80 backdrop-blur-md border border-gray-200/50 shadow-xl'
                }`}
        >
            <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6">
                <Image
                    src="/assets/logo.png"
                    alt="WordPanda"
                    width={60}
                    height={60}
                    className="opacity-80"
                />
            </div>

            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                All caught up!
            </h3>

            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {`You've completed all the flashcards for this session. Keep up the good work!`}
            </p>

            <motion.button
                whileHover={{ scale: 1.05, boxShadow: `0 0 20px rgba(16, 185, 129, 0.4)` }}
                whileTap={{ scale: 0.97 }}
                className="mt-8 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium shadow-lg"
            >
                Refresh Cards
            </motion.button>
        </motion.div>
    );
};

export function FlashBody({ words, lang, mediaId }: { words: { word: string }[], lang: string, mediaId?: string }) {
    const [index, setIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [wordsCards, setWordsCards] = useState<WordWithTranslationsAndUserWords[]>([]);
    const [{ data: wordsList, err: wordsListErr, msg: wordsListMsg }, setWordsList] = useState<WordsPostResponse>({});
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Function to update the list of words
    const updateList = useCallback(async () => {
        setIsLoading(true);
        const response = await getWords({
            ...(mediaId ? { mediaId } : { words: words.slice(index, index + 20).map(x => x.word) }),
            limit: 20,
            language: lang,
        });
        setIndex(index + 20);
        setWordsCards(response?.data?.words || []);
        setWordsList(response);
        setIsLoading(false);
    }, [index, lang, mediaId, words]);

    // Initialize the word list
    useEffect(() => {
        if (!wordsCards.length) updateList();
    }, [wordsCards, updateList]);

    const slice = wordsCards?.slice(0, 20) || [];
    const current = slice[0];

    // Move current card to the end
    const moveToEndItem = () => {
        if (wordsCards.length <= 1) {
            updateList();
            return;
        }

        setWordsCards(cards => {
            const [first, ...others] = cards;
            return [...others, first];
        });
    };

    // Mark word as hard
    const markAsHard = async () => {
        if (!current) return;

        try {
            await flashGameAction({
                wordId: current.id,
                hard: true,
                ...(mediaId && { mediaId })
            });
        } catch (error) {
            console.error("Error marking word as hard:", error);
        }

        moveToEndItem();
    };

    // Mark word as easy
    const markAsEasy = async () => {
        if (!current) return;

        try {
            await flashGameAction({
                wordId: current.id,
                hard: false,
                ...(mediaId && { mediaId })
            });
        } catch (error) {
            console.error("Error marking word as easy:", error);
        }

        moveToEndItem();
    };

    // Skip current word
    const skipWord = () => moveToEndItem();

    if (isLoading) return <Loading />;

    return (
        <div className="container mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8"
            >
                <h1 className={`text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r ${isDark
                    ? 'from-emerald-300 to-cyan-300'
                    : 'from-emerald-600 to-cyan-600'
                    }`}>
                    WordPanda Flashcards
                </h1>
                <p className={isDark ? 'text-zinc-300' : 'text-zinc-600'}>
                    Tap to flip cards and improve your vocabulary
                </p>
            </motion.div>

            {slice.length > 0 ? (
                <>
                    <ProgressIndicator
                        current={index - wordsCards.length}
                        total={index}
                    />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current?.id || 'current'}
                            initial={{ x: 10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -10, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-md mx-auto"
                        >
                            <FlashCard
                                word={current}
                                onHard={markAsHard}
                                onEasy={markAsEasy}
                                onSkip={skipWord}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Instructions */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-12 text-center"
                    >
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            <span className="inline-block mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                                </svg>
                            </span>
                            Tap the card to see the translation or click the buttons below
                        </p>
                    </motion.div>
                </>
            ) : (
                <EmptyState />
            )}
        </div>
    );
}