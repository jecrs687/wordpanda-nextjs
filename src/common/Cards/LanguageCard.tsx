import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReactNode } from 'react';

type Props = {
    id: string;
    language: string;
    code: string;
    wordsNumber: number;
    totalWordsNumber: number;
    totalOfMedias?: number;
    totalOfLearnings?: number;
    totalOfSpeaks?: number;
};

const StatBadge = ({ value, label }: { value: number | ReactNode; label: string }) => (
    <div className="flex flex-col items-center">
        <span className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">{value}</span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
    </div>
);

export default function LanguageCard({
    id,
    language,
    code,
    wordsNumber,
    totalWordsNumber,
    totalOfMedias,
    totalOfLearnings,
    totalOfSpeaks,
}: Props) {
    // Calculate progress percentage
    const progressPercentage = Math.min(Math.round((wordsNumber / totalWordsNumber) * 100), 100) || 0;

    // Get country code for flag
    const countryCode = code.split('-')[0];

    return (
        <motion.div
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="h-full"
        >
            <Link href={`/languages/${id}`} className="block h-full">
                <div className="relative h-full bg-gradient-to-br from-white to-zinc-50 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden shadow-lg border border-zinc-100 dark:border-zinc-800 transition-all duration-300 hover:shadow-emerald-100 dark:hover:shadow-emerald-900/20 hover:border-emerald-200 dark:hover:border-emerald-800">
                    {/* Flag background */}
                    <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 dark:from-indigo-700/20 dark:to-emerald-700/20" />

                    {/* Content */}
                    <div className="p-5 relative">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden shadow-md border-2 border-white dark:border-gray-700 mr-3">
                                <img
                                    src={`https://flagcdn.com/${countryCode}.svg`}
                                    alt={`${language} flag`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "https://via.placeholder.com/48?text=Flag";
                                    }}
                                />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-800 dark:text-white">
                                {language}
                            </h3>
                        </div>

                        {/* Progress bar */}
                        <div className="mb-4">
                            <div className="flex justify-between mb-1 text-xs">
                                <span className="text-zinc-600 dark:text-zinc-300">Vocabulary Progress</span>
                                <span className="font-medium text-emerald-600 dark:text-emerald-400">{progressPercentage}%</span>
                            </div>
                            <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2.5">
                                <div
                                    className="h-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-indigo-500"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                <span>{wordsNumber} words</span>
                                <span>{totalWordsNumber} total</span>
                            </div>
                        </div>

                        {/* Stats grid */}
                        {(totalOfMedias !== undefined || totalOfLearnings !== undefined || totalOfSpeaks !== undefined) && (
                            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-700">
                                {totalOfMedias !== undefined && (
                                    <StatBadge value={totalOfMedias} label="Media" />
                                )}
                                {totalOfLearnings !== undefined && (
                                    <StatBadge value={totalOfLearnings} label="Learners" />
                                )}
                                {totalOfSpeaks !== undefined && (
                                    <StatBadge value={totalOfSpeaks} label="Speakers" />
                                )}
                            </div>
                        )}

                        {/* Call to action */}
                        <div className="absolute bottom-3 right-3">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-500 dark:bg-emerald-600 text-white shadow-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
