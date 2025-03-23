'use client';

import { motion } from 'framer-motion';
import { AlertCircle, PawPrint } from 'lucide-react';
import Link from 'next/link';

type EmptyStateProps = {
    title?: string;
    message?: string;
    actionLink?: string;
    actionText?: string;
};

const EmptyState = ({
    title = "No Words Available",
    message = "There aren't enough words available to play this game. Please try with a different language or add more words.",
    actionLink = "/extension/languages",
    actionText = "Select Language"
}: EmptyStateProps) => {
    return (
        <div className="w-full h-[80vh] flex items-center justify-center p-4">
            <motion.div
                className="max-w-md w-full p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                            <AlertCircle className="h-8 w-8 text-amber-500 dark:text-amber-400" />
                        </div>
                        <PawPrint className="absolute -bottom-1 -right-1 h-6 w-6 text-gray-400 dark:text-gray-600" />
                    </div>
                </div>

                <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{title}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {message}
                </p>

                <Link href={actionLink}>
                    <motion.button
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-lg shadow-lg shadow-emerald-500/20 dark:shadow-emerald-700/30 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {actionText}
                    </motion.button>
                </Link>
            </motion.div>
        </div>
    );
};

export default EmptyState;
