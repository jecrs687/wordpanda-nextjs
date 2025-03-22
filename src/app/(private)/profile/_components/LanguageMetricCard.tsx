"use client";

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface MetricItem {
    name: string;
    value: string | number;
}

interface LanguageMetricCardProps {
    languageName: string;
    languageCode: string;
    metrics: MetricItem[];
    index: number;
}

export default function LanguageMetricCard({
    languageName,
    languageCode,
    metrics,
    index
}: LanguageMetricCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="w-full rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm"
        >
            <div
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold">
                        {languageCode?.split('-')[0]?.toUpperCase()}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                        {languageName} {languageCode ? `(${languageCode.split('-')[0]})` : ''}
                    </h3>
                </div>
                <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
                />
            </div>

            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 pb-4"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                        {metrics.map((metric, i) => (
                            <div
                                key={i}
                                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                            >
                                <p className="text-sm text-gray-500 dark:text-gray-400">{metric.name}</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{metric.value || '-'}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
