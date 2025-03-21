import { motion } from 'framer-motion';
import { Inter } from 'next/font/google';

interface ScorePanelProps {
    score: number;
    moves: number;
    timeElapsed: number;
    matchedPairs: number;
    totalPairs: number;
    isDark: boolean;
    inter: ReturnType<typeof Inter>;
}

export default function ScorePanel({
    score,
    moves,
    timeElapsed,
    matchedPairs,
    totalPairs,
    isDark,
    inter
}: ScorePanelProps) {
    // Format time as MM:SS
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate progress percentage
    const progressPercentage = (matchedPairs / totalPairs) * 100;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`mt-6 p-4 rounded-xl border backdrop-blur-md
        ${isDark
                    ? 'bg-gray-900/40 border-gray-700/50'
                    : 'bg-white/60 border-gray-200/50'}`}
        >
            <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
                <div className="flex items-center">
                    <div className="flex flex-col">
                        <span className={`${inter.className} text-xs text-gray-500 dark:text-gray-400`}>
                            Matched Pairs
                        </span>
                        <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                            {matchedPairs} / {totalPairs}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="flex flex-col items-center">
                        <span className={`${inter.className} text-xs text-gray-500 dark:text-gray-400`}>Score</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{score}</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <span className={`${inter.className} text-xs text-gray-500 dark:text-gray-400`}>Moves</span>
                        <span className="font-bold text-cyan-600 dark:text-cyan-400">{moves}</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <span className={`${inter.className} text-xs text-gray-500 dark:text-gray-400`}>Time</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">{formatTime(timeElapsed)}</span>
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                    <span className={`${inter.className} text-xs text-gray-600 dark:text-gray-300`}>Game Progress</span>
                    <span className={`${inter.className} text-xs font-medium text-emerald-600 dark:text-emerald-400`}>
                        {Math.round(progressPercentage)}%
                    </span>
                </div>

                <div className={`h-2 w-full rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                    />
                </div>
            </div>
        </motion.div>
    );
}
