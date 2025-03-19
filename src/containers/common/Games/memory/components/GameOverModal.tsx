import { motion } from 'framer-motion';
import { NextFont } from 'next/dist/compiled/@next/font';
import { Inter } from 'next/font/google';

interface GameOverModalProps {
    score: number;
    moves: number;
    timeElapsed: number;
    onRestart: () => void;
    poppins: NextFont;
    inter: ReturnType<typeof Inter>;
}

export default function GameOverModal({
    score,
    moves,
    timeElapsed,
    onRestart,
    poppins,
    inter
}: GameOverModalProps) {
    // Format time as MM:SS
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate star rating based on moves and time
    const getStarRating = (): number => {
        // This is a simple algorithm - could be refined based on game testing
        const avgMovesPerPair = moves / 6; // Assuming 6 pairs
        const timePerPair = timeElapsed / 6;

        if (avgMovesPerPair <= 2 && timePerPair < 10) return 3;
        if (avgMovesPerPair <= 3 && timePerPair < 20) return 2;
        return 1;
    };

    const starRating = getStarRating();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
            <motion.div
                initial={{ scale: 0.8, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, y: 30, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200/50 dark:border-gray-700/50"
            >
                <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 py-6 px-8 text-white">
                    <h3 className={`${poppins.className} text-2xl font-bold text-center`}>
                        Parabéns!
                    </h3>
                    <p className="text-center text-white/90 mt-1">
                        Você completou o jogo da memória!
                    </p>
                </div>

                <div className="p-6">
                    {/* Stars rating */}
                    <div className="flex justify-center mb-6">
                        {[1, 2, 3].map((star) => (
                            <motion.div
                                key={star}
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{
                                    scale: 1,
                                    rotate: 0,
                                    opacity: star <= starRating ? 1 : 0.3
                                }}
                                transition={{
                                    delay: 0.3 + (star * 0.2),
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 15
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className={`w-12 h-12 mx-1 ${star <= starRating ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'
                                        }`}
                                >
                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                </svg>
                            </motion.div>
                        ))}
                    </div>

                    {/* Game stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pontuação</div>
                            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{score}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Jogadas</div>
                            <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{moves}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tempo</div>
                            <div className="text-xl font-bold text-cyan-600 dark:text-cyan-400">{formatTime(timeElapsed)}</div>
                        </div>
                    </div>

                    {/* Feedback message */}
                    <div className="text-center mb-6">
                        <p className={`${inter.className} text-gray-600 dark:text-gray-300`}>
                            {starRating === 3 ? (
                                "Excelente! Você dominou o jogo da memória!"
                            ) : starRating === 2 ? (
                                "Muito bom! Pratique mais para melhorar sua pontuação!"
                            ) : (
                                "Bom trabalho! Continue praticando para aumentar sua memória!"
                            )}
                        </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-4">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onRestart}
                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold shadow-lg hover:shadow-emerald-500/20 transition-all duration-300"
                        >
                            Jogar Novamente
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
