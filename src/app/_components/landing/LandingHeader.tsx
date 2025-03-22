import { cn } from '@utils/utils';
import { motion } from 'framer-motion';

interface LandingHeaderProps {
    isDarkMode: boolean;
    statusBarHeight: number;
}

export function LandingHeader({ isDarkMode, statusBarHeight }: LandingHeaderProps) {
    return (
        <motion.div
            className="absolute top-0 left-0 right-0 flex justify-center pt-8 z-40"
            style={{ paddingTop: `${Math.max(8 + (+statusBarHeight) * 2, 32)}px` }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <motion.div
                className={cn(
                    "flex items-center space-x-3",
                    "px-4 py-2 rounded-full backdrop-blur-sm",
                    isDarkMode
                        ? "bg-black/30 border border-zinc-800"
                        : "bg-white/30 border border-zinc-200"
                )}
                whileHover={{ scale: 1.02 }}
            >
                <motion.div
                    className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        isDarkMode ? "bg-white text-black" : "bg-black text-white"
                    )}
                    animate={{ rotate: [0, 5, 0, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, repeatType: "loop" }}
                >
                    <span className="text-xl">🐼</span>
                </motion.div>

                <h1 className={cn(
                    "text-lg font-bold",
                    isDarkMode ? "text-white" : "text-zinc-900"
                )}>
                    WordPanda
                </h1>
            </motion.div>
        </motion.div>
    );
}
