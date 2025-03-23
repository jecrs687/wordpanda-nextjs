import { motion } from 'framer-motion';
import { Info, PawPrint } from 'lucide-react';
import { useState } from 'react';
import { WordWithTranslationsAndUserWords } from 'src/app/api/words/route';

export default function Card({ word, style }: {
    word: WordWithTranslationsAndUserWords
    style?: React.CSSProperties,
}) {
    const [side, setSide] = useState<boolean>(true);

    function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e?.stopPropagation();
        setSide((side) => !side);
    }

    // Calculate difficulty level based on user stats
    const getDifficultyInfo = () => {
        if (word.userWords.length === 0) return { color: 'bg-blue-500 dark:bg-blue-600', label: 'New' };

        const errorRate = word.userWords[0]?.errors / Math.max(1, word.userWords[0]?.attempts);

        if (errorRate > 0.3) return { color: 'bg-rose-500 dark:bg-rose-600', label: 'Hard' };
        return { color: 'bg-emerald-500 dark:bg-emerald-600', label: 'Easy' };
    };

    const difficultyInfo = getDifficultyInfo();

    return (
        <motion.div
            className={`relative h-full w-full perspective-1000 cursor-pointer ${side ? '' : 'rotate-y-180'}`}
            onClick={handleClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
            {/* Difficulty indicator */}
            <div className={`absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full ${difficultyInfo.color} flex items-center justify-center shadow-md`}>
                <span className="text-xs text-white font-bold">{difficultyInfo.label[0]}</span>
            </div>

            {/* Front side */}
            <motion.div
                className={`absolute inset-0 backface-hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${side ? 'opacity-100' : 'opacity-0'}`}
            >
                <div className="relative h-full p-4 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {word.word}
                        </h3>
                        <PawPrint className="h-5 w-5 text-emerald-500 dark:text-emerald-400 opacity-60" />
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 text-sm flex-grow">
                        {word?.translations?.[0]?.meaning || "No meaning available"}
                    </p>

                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <Info className="h-3 w-3 mr-1" />
                            Tap to see translations
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Back side */}
            <motion.div
                className={`absolute inset-0 backface-hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden rotate-y-180 ${side ? 'opacity-0' : 'opacity-100'}`}
            >
                <div className="relative h-full p-4 flex flex-col">
                    <div className="mb-3">
                        <h4 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Translations</h4>
                        <div className="flex flex-wrap gap-1 mb-2">
                            {word?.translations?.[0]?.translations?.length > 0 ? (
                                word.translations[0].translations.map(({ word: translatedWord }, index) => (
                                    <span key={index} className="inline-block px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm rounded-md">
                                        {translatedWord}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-500 dark:text-gray-400 text-sm">No translations available</span>
                            )}
                        </div>
                    </div>

                    {word?.translations?.[0]?.meaningTranslated && (
                        <div className="mt-auto">
                            <h4 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Meaning</h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                {word.translations[0].meaningTranslated}
                            </p>
                        </div>
                    )}

                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <Info className="h-3 w-3 mr-1" />
                            Tap to see word
                        </span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
