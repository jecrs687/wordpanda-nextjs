import { cn } from '@utils/utils';
import { motion } from 'framer-motion';

interface BackgroundDecorationProps {
    isDarkMode: boolean;
}

export function BackgroundDecoration({ isDarkMode }: BackgroundDecorationProps) {
    return (
        <>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Bamboo leaf pattern - top right */}
                <motion.div
                    className={cn(
                        "absolute top-0 right-0 w-64 h-64 opacity-10",
                        isDarkMode ? "text-green-400" : "text-green-600"
                    )}
                    animate={{
                        y: [0, 5, 0],
                        x: [0, -3, 0],
                    }}
                    transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
                >
                    <svg viewBox="0 0 100 100" fill="currentColor">
                        <path d="M10,50 Q30,30 50,50 T90,50 Q70,70 50,50 T10,50" />
                    </svg>
                </motion.div>

                {/* Bamboo stick pattern - bottom left */}
                <motion.div
                    className={cn(
                        "absolute bottom-0 left-0 w-72 h-72 opacity-10",
                        isDarkMode ? "text-green-500" : "text-green-700"
                    )}
                    animate={{
                        y: [0, -8, 0],
                        x: [0, 5, 0],
                    }}
                    transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
                >
                    <svg viewBox="0 0 100 100" fill="currentColor">
                        <rect x="10" y="10" width="5" height="80" rx="2" />
                        <rect x="30" y="5" width="5" height="90" rx="2" />
                        <rect x="50" y="15" width="5" height="70" rx="2" />
                    </svg>
                </motion.div>
            </div>

            {/* Subtle accent circles */}
            <motion.div
                className={cn(
                    "absolute -top-20 right-1/4 w-32 h-32 rounded-full blur-3xl opacity-10",
                    isDarkMode ? "bg-green-900" : "bg-green-200"
                )}
                animate={{
                    y: [0, -20, 0],
                    scale: [1, 1.05, 1],
                }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.div
                className={cn(
                    "absolute bottom-20 left-1/3 w-40 h-40 rounded-full blur-3xl opacity-10",
                    isDarkMode ? "bg-green-800" : "bg-green-100"
                )}
                animate={{
                    y: [0, 30, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", delay: 2 }}
            />
        </>
    );
}
