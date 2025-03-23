'use client';

import { motion } from 'framer-motion';
import { Award, Clock, RefreshCw, RotateCcw } from 'lucide-react';
import { NextFont } from 'next/dist/compiled/@next/font';
import GameButton from '../../_components/GameButton';

type GameOverModalProps = {
    score: number;
    moves: number;
    timeElapsed: number;
    onRestart: () => void;
    poppins: NextFont;
    inter: NextFont;
};

const GameOverModal = ({
    score,
    moves,
    timeElapsed,
    onRestart,
    poppins,
    inter
}: GameOverModalProps) => {
    // Format time as mm:ss
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 dark:bg-black/50 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl p-6 md:p-8 max-w-md w-full border border-gray-200/50 dark:border-gray-700/50 shadow-xl"
            >
                <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                        <motion.div
                            className="relative"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 1, repeat: 2 }}
                        >
                            <Award className="h-16 w-16 text-amber-500 dark:text-amber-400" />
                            <motion.span
                                className="absolute inset-0 rounded-full bg-amber-400/20"
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </motion.div>
                    </div>
                    <h2 className={`text-3xl font-bold text-gray-900 dark:text-white mb-2 ${poppins.className}`}>
                        Congratulations!
                    </h2>
                    <p className={`text-gray-600 dark:text-gray-300 ${inter.className}`}>
                        You've completed the memory game. Here are your stats:
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-100/80 dark:bg-gray-800/80 rounded-xl p-4 text-center">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Award className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mx-auto mb-1" />
                            <p className={`text-sm text-gray-500 dark:text-gray-400 ${inter.className}`}>Score</p>
                            <p className={`text-2xl font-bold text-emerald-600 dark:text-emerald-400 ${poppins.className}`}>
                                {score}
                            </p>
                        </motion.div>
                    </div>

                    <div className="bg-gray-100/80 dark:bg-gray-800/80 rounded-xl p-4 text-center">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Clock className="h-5 w-5 text-blue-500 dark:text-blue-400 mx-auto mb-1" />
                            <p className={`text-sm text-gray-500 dark:text-gray-400 ${inter.className}`}>Time</p>
                            <p className={`text-2xl font-bold text-blue-600 dark:text-blue-400 ${poppins.className}`}>
                                {formatTime(timeElapsed)}
                            </p>
                        </motion.div>
                    </div>

                    <div className="bg-gray-100/80 dark:bg-gray-800/80 rounded-xl p-4 text-center">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <RotateCcw className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mx-auto mb-1" />
                            <p className={`text-sm text-gray-500 dark:text-gray-400 ${inter.className}`}>Moves</p>
                            <p className={`text-2xl font-bold text-indigo-600 dark:text-indigo-400 ${poppins.className}`}>
                                {moves}
                            </p>
                        </motion.div>
                    </div>

                    <div className="bg-gray-100/80 dark:bg-gray-800/80 rounded-xl p-4 text-center">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="h-5 w-5 text-amber-500 dark:text-amber-400 mx-auto mb-1 flex items-center justify-center">
                                <span className="text-lg font-bold">🧠</span>
                            </div>
                            <p className={`text-sm text-gray-500 dark:text-gray-400 ${inter.className}`}>Efficiency</p>
                            <p className={`text-2xl font-bold text-amber-600 dark:text-amber-400 ${poppins.className}`}>
                                {moves > 0 ? Math.round((score / moves) * 10) / 10 : 0}
                            </p>
                        </motion.div>
                    </div>
                </div>

                <GameButton
                    onClick={onRestart}
                    variant="primary"
                    size="lg"
                    fullWidth
                    icon={<RefreshCw className="h-5 w-5" />}
                >
                    Play Again
                </GameButton>
            </motion.div>
        </motion.div>
    );
};

export default GameOverModal;
