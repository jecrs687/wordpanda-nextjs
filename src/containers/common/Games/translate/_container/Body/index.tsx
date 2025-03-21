'use client';
import { memoryGameAction } from '@backend/domain/actions/Games/memory.action';
import { getWords } from '@backend/domain/actions/Word/getWords.action';
import LoaderSpinner from '@core/LoaderSpinner';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

type WordItem = {
    id: string;
    word: string;
    translation: string;
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
    const [allWords, setAllWords] = useState<WordItem[]>([]);
    const [currentWord, setCurrentWord] = useState<WordItem | null>(null);
    const [userInput, setUserInput] = useState('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch words
    const fetchWords = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getWords({
                language: lang,
                ...(mediaId ? { mediaId } : { words: words.map(x => x.word) }),
                limit: 10
            });

            if (response?.data?.words) {
                const formattedWords = response.data.words.map(word => ({
                    id: word.id,
                    word: word.word,
                    translation: word.translations?.[0]?.meaning || 'No translation available',
                }));
                setAllWords(formattedWords);
            }
        } catch (error) {
            console.error('Error fetching words:', error);
        } finally {
            setIsLoading(false);
        }
    }, [lang, mediaId, words]);

    useEffect(() => {
        fetchWords();
    }, [fetchWords]);

    useEffect(() => {
        if (allWords.length > 0 && !currentWord) {
            setCurrentWord(allWords[0]);
        }
    }, [allWords, currentWord]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
    };

    const checkAnswer = async () => {
        if (!currentWord) return;

        const isAnswerCorrect = userInput.trim().toLowerCase() === currentWord.translation.toLowerCase();
        setIsCorrect(isAnswerCorrect);

        if (isAnswerCorrect) {
            setScore(prev => prev + 10);
            try {
                await memoryGameAction({
                    wordId: currentWord.id,
                    hard: false,
                    mediaId,
                });
            } catch (error) {
                console.error('Error recording success:', error);
            }
        } else {
            try {
                await memoryGameAction({
                    wordId: currentWord.id,
                    hard: true,
                    mediaId,
                });
            } catch (error) {
                console.error('Error recording failure:', error);
            }
        }

        setTimeout(() => {
            setIsCorrect(null);
            setUserInput('');
            setCurrentWord(allWords[1] || null);
            setAllWords(prev => prev.slice(1));
        }, 2000);
    };

    if (isLoading) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <LoaderSpinner size="large" />
            </div>
        );
    }

    if (!currentWord) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <p className="text-zinc-300">No more words to translate!</p>
            </div>
        );
    }

    return (
        <div className="relative h-full w-full flex flex-col items-center justify-center p-6">
            <motion.div
                className="w-full max-w-lg bg-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mb-6 text-center">
                    <h3 className="text-zinc-300 text-sm uppercase tracking-wider mb-2">Translate the Word</h3>
                    <p className="text-white text-2xl font-bold">{currentWord.word}</p>
                </div>

                <div className="mb-6">
                    <input
                        type="text"
                        value={userInput}
                        onChange={handleInputChange}
                        placeholder="Type the translation..."
                        className={clsx(
                            'w-full px-4 py-3 rounded-lg bg-gray-800/60 border-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all',
                            isCorrect === true
                                ? 'border-emerald-400 focus:ring-emerald-400'
                                : isCorrect === false
                                    ? 'border-rose-400 focus:ring-rose-400'
                                    : 'border-gray-700 focus:ring-indigo-400'
                        )}
                    />
                </div>

                <div className="flex justify-center">
                    <motion.button
                        className={clsx(
                            'px-6 py-3 rounded-lg font-medium shadow-lg transition-all',
                            userInput.trim()
                                ? 'bg-emerald-500 text-white hover:bg-emerald-400'
                                : 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                        )}
                        onClick={checkAnswer}
                        disabled={!userInput.trim()}
                        whileHover={{ scale: userInput.trim() ? 1.05 : 1 }}
                        whileTap={{ scale: userInput.trim() ? 0.95 : 1 }}
                    >
                        Submit
                    </motion.button>
                </div>
            </motion.div>

            <div className="absolute top-4 right-4">
                <p className="text-white">Score: {score}</p>
            </div>
        </div>
    );
};