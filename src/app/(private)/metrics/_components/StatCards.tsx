"use client";

import { motion } from "framer-motion";
import { BookOpen, Calendar, CheckCircle, Globe } from "lucide-react";

interface StatCardsProps {
    streak: number;
    languageCount: number;
    wordsCount: number;
    successRate: number;
}

export default function StatCards({ streak, languageCount, wordsCount, successRate }: StatCardsProps) {
    const stats = [
        {
            name: "Current Streak",
            value: `${streak} ${streak === 1 ? 'day' : 'days'}`,
            icon: <Calendar className="h-5 w-5 text-amber-500" />,
            bgClass: "bg-amber-50 dark:bg-amber-900/20",
            textClass: "text-amber-800 dark:text-amber-200"
        },
        {
            name: "Languages",
            value: languageCount,
            icon: <Globe className="h-5 w-5 text-blue-500" />,
            bgClass: "bg-blue-50 dark:bg-blue-900/20",
            textClass: "text-blue-800 dark:text-blue-200"
        },
        {
            name: "Words Learning",
            value: wordsCount,
            icon: <BookOpen className="h-5 w-5 text-indigo-500" />,
            bgClass: "bg-indigo-50 dark:bg-indigo-900/20",
            textClass: "text-indigo-800 dark:text-indigo-200"
        },
        {
            name: "Success Rate",
            value: `${Math.round(successRate)}%`,
            icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
            bgClass: "bg-emerald-50 dark:bg-emerald-900/20",
            textClass: "text-emerald-800 dark:text-emerald-200"
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className={`${stat.bgClass} rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4`}
                >
                    <div className="flex flex-col h-full">
                        <div className="flex items-center mb-2">
                            <div className="p-2 rounded-lg bg-white dark:bg-gray-800 mr-2">
                                {stat.icon}
                            </div>
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {stat.name}
                            </h3>
                        </div>
                        <p className={`text-2xl md:text-3xl font-bold mt-auto ${stat.textClass}`}>
                            {stat.value}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
