"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, MoreHorizontal, Zap } from "lucide-react";
import { useMemo } from "react";

interface WordsTableProps {
    words: any[];
    type: "practiced" | "challenging";
}

export default function WordsTable({ words, type }: WordsTableProps) {
    const displayWords = useMemo(() => words?.slice(0, 5) || [], [words]);

    if (!displayWords.length) {
        return (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <MoreHorizontal className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">No word data available yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Keep practicing to see your most {type === "practiced" ? "practiced" : "challenging"} words here
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="pb-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Word</th>
                        <th className="pb-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Language</th>
                        <th className="pb-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {type === "practiced" ? "Attempts" : "Error Rate"}
                        </th>
                        <th className="pb-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {displayWords.map((word, index) => (
                        <motion.tr
                            key={`${word.word}-${index}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                            <td className="py-3 text-sm font-medium text-gray-900 dark:text-white">
                                <div className="flex items-center">
                                    <div
                                        className={`w-2 h-2 rounded-full mr-2 ${type === "practiced"
                                            ? "bg-emerald-400"
                                            : "bg-rose-400"
                                            }`}
                                    />
                                    {word.word}
                                </div>
                            </td>
                            <td className="py-3 text-sm text-gray-600 dark:text-gray-300">
                                <div className="flex items-center">
                                    <span className="font-medium">{word.language}</span>
                                    <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                                        ({word.languageCode?.split('-')[0]})
                                    </span>
                                </div>
                            </td>
                            <td className="py-3 text-sm text-gray-600 dark:text-gray-300">
                                {type === "practiced" ? (
                                    <div className="flex items-center">
                                        <Zap className="h-4 w-4 text-amber-500 mr-1" />
                                        <span>{word.attempts}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <AlertCircle className="h-4 w-4 text-rose-500 mr-1" />
                                        <span>{Math.round(word.errorRate)}%</span>
                                    </div>
                                )}
                            </td>
                            <td className="py-3 text-sm text-gray-600 dark:text-gray-300 text-right">
                                {word.mastered ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Mastered
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                                        Learning
                                    </span>
                                )}
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}
