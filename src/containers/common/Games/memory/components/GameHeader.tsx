'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Brain } from 'lucide-react';
import { Inter } from 'next/font/google';
import Link from 'next/link';

type GameHeaderProps = {
    title: string;
    description: string;
    score: number;
    moves: number;
    gameTime: number;
    poppins: ReturnType<typeof Inter>;
    inter: ReturnType<typeof Inter>;
};

const GameHeader = ({
    title,
    description,
    score,
    moves,
    gameTime,
    poppins,
    inter
}: GameHeaderProps) => {
    // Format time as minutes:seconds
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Link href="/extension/games">
                        <motion.div
                            className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-full border border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </motion.div>
                    </Link>

                    <div className="flex items-center">
                        <div className="p-2 mr-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                            <Brain className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h1 className={`text-2xl font-bold text-gray-900 dark:text-white ${poppins.className}`}>{title}</h1>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-gray-200/50 dark:border-gray-700/50">
                        <p className={`text-xs text-gray-500 dark:text-gray-400 ${inter.className}`}>Score</p>
                        <p className={`text-lg font-bold text-emerald-600 dark:text-emerald-400 ${poppins.className}`}>{score}</p>
                    </div>

                    <div className="hidden sm:block bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-gray-200/50 dark:border-gray-700/50">
                        <p className={`text-xs text-gray-500 dark:text-gray-400 ${inter.className}`}>Moves</p>
                        <p className={`text-lg font-bold text-indigo-600 dark:text-indigo-400 ${poppins.className}`}>{moves}</p>
                    </div>

                    <div className="hidden md:block bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-gray-200/50 dark:border-gray-700/50">
                        <p className={`text-xs text-gray-500 dark:text-gray-400 ${inter.className}`}>Time</p>
                        <p className={`text-lg font-bold text-blue-600 dark:text-blue-400 ${poppins.className}`}>{formatTime(gameTime)}</p>
                    </div>
                </div>
            </div>

            <p className={`text-gray-600 dark:text-gray-300 ml-14 ${inter.className}`}>
                {description}
            </p>
        </motion.div>
    );
};

export default GameHeader;
