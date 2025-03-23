'use client';

import { motion } from 'framer-motion';
import { Award, Clock, RotateCcw } from 'lucide-react';
import { NextFont } from 'next/dist/compiled/@next/font';

type ScorePanelProps = {
    score: number;
    moves: number;
    timeElapsed: number;
    matchedPairs: number;
    totalPairs: number;
    isDark: boolean;
    inter: NextFont;
};

const ScorePanel = ({
    score,
    moves,
    timeElapsed,
    matchedPairs,
    totalPairs,
    isDark,
    inter
}: ScorePanelProps) => {
    // Format time as mm:ss
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <motion.div
            className="mt-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 dark:border-gray-700/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 ${inter.className}`}>
                <div className="flex items-center gap-2">
                    <div className="bg-emerald-100/80 dark:bg-emerald-900/30 p-2 rounded-full">
                        <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Score</p>
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{score}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="bg-blue-100/80 dark:bg-blue-900/30 p-2 rounded-full">
                        <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Time</p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatTime(timeElapsed)}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="bg-indigo-100/80 dark:bg-indigo-900/30 p-2 rounded-full">
                        <RotateCcw className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Moves</p>
                        <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{moves}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="bg-amber-100/80 dark:bg-amber-900/30 p-2 rounded-full">
                        <div className="h-4 w-4 flex items-center justify-center text-amber-600 dark:text-amber-400">
                            <span className="text-sm font-bold">🧩</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Pairs</p>
                        <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                            {matchedPairs}/{totalPairs}
                        </p>
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(matchedPairs / totalPairs) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
        </motion.div>
    );
};

export default ScorePanel;
