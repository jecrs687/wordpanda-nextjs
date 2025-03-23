'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Info } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import GameButton from '../_components/GameButton';

type GameLayoutProps = {
    children: React.ReactNode;
    title: string;
    description?: string;
    icon?: React.ReactNode;
    backLink?: string;
    instructions?: React.ReactNode;
    className?: string;
};

const GameLayout = ({
    children,
    title,
    description,
    icon,
    backLink = '/extension/games',
    instructions,
    className = '',
}: GameLayoutProps) => {
    const [showInstructions, setShowInstructions] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`min-h-screen w-full bg-gradient-to-br from-white via-zinc-50 to-sky-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 ${className}`}
        >
            {/* Decorative elements */}
            <div className="fixed top-20 right-20 w-64 h-64 bg-emerald-400/5 dark:bg-emerald-400/10 rounded-full blur-3xl -z-10" />
            <div className="fixed bottom-40 left-20 w-80 h-80 bg-indigo-400/5 dark:bg-indigo-400/10 rounded-full blur-3xl -z-10" />
            <div className="fixed top-1/3 left-1/3 w-72 h-72 bg-blue-400/5 dark:bg-blue-400/10 rounded-full blur-3xl -z-10" />

            {/* Main content */}
            <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                            <Link href={backLink} className="mr-3">
                                <motion.div
                                    className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-full border border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </motion.div>
                            </Link>

                            <div className="flex items-center">
                                {icon && (
                                    <div className="p-2 mr-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                                        {icon}
                                    </div>
                                )}
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
                            </div>
                        </div>

                        {instructions && (
                            <GameButton
                                onClick={() => setShowInstructions(!showInstructions)}
                                variant="outline"
                                size="sm"
                                icon={<Info className="h-4 w-4" />}
                            >
                                Instructions
                            </GameButton>
                        )}
                    </div>

                    {description && (
                        <p className="text-gray-600 dark:text-gray-300 ml-14">
                            {description}
                        </p>
                    )}
                </motion.div>

                {/* Instructions panel */}
                {instructions && showInstructions && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50"
                    >
                        {instructions}
                    </motion.div>
                )}

                {/* Main content */}
                {children}
            </div>
        </motion.div>
    );
};

export default GameLayout;
