import { motion } from 'framer-motion';
import { NextFont } from 'next/dist/compiled/@next/font';
import { Inter } from 'next/font/google';
import Image from 'next/image';

interface GameHeaderProps {
    title: string;
    description: string;
    score: number;
    moves: number;
    gameTime: number;
    poppins: NextFont;
    inter: ReturnType<typeof Inter>;
}

export default function GameHeader({
    title,
    description,
    score,
    moves,
    gameTime,
    poppins,
    inter
}: GameHeaderProps) {
    // Format time as MM:SS
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex items-center">
                    <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-0.5 rounded-xl mr-3">
                        <div className="bg-white dark:bg-gray-900 p-2 rounded-lg">
                            <motion.div
                                animate={{ rotate: [0, 10, 0, -10, 0] }}
                                transition={{
                                    repeat: Infinity,
                                    repeatDelay: 5,
                                    duration: 2.5,
                                    ease: "easeInOut"
                                }}
                            >
                                <Image
                                    src="/assets/logo.png"
                                    alt="WordPanda"
                                    width={40}
                                    height={40}
                                />
                            </motion.div>
                        </div>
                    </div>

                    <div>
                        <h1 className={`${poppins.className} text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-indigo-400`}>
                            {title}
                        </h1>
                        <p className={`${inter.className} text-sm text-gray-600 dark:text-gray-400`}>
                            {description}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 py-2 px-4 bg-white/70 dark:bg-gray-800/50 rounded-xl backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Score</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{score}</span>
                    </div>
                    <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Moves</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{moves}</span>
                    </div>
                    <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Time</span>
                        <span className="font-bold text-cyan-600 dark:text-cyan-400">{formatTime(gameTime)}</span>
                    </div>
                </div>
            </div>

            <p className={`${inter.className} text-base text-gray-700 dark:text-gray-300 max-w-3xl`}>
                Find matching pairs by flipping cards to reveal the words. Match each word with its translation.
                The faster you complete with fewer moves, the higher your score!
            </p>
        </motion.div>
    );
}
