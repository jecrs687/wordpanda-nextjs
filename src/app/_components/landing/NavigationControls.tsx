import { cn } from '@utils/utils';
import { motion } from 'framer-motion';

interface NavigationControlsProps {
    step: number;
    totalSteps: number;
    handleTap: (direction: 'left' | 'right') => void;
    isDarkMode: boolean;
}

export function NavigationControls({ step, totalSteps, handleTap, isDarkMode }: NavigationControlsProps) {
    return (
        <div className="absolute inset-0 z-30 flex justify-between items-center px-4 py-20 md:px-6">
            {step > 0 && (
                <motion.div
                    className={cn(
                        "p-2.5 rounded-full backdrop-blur-lg cursor-pointer shadow-lg border",
                        isDarkMode
                            ? "bg-zinc-900/60 hover:bg-zinc-800/80 text-white border-zinc-800"
                            : "bg-white/60 hover:bg-white/80 text-zinc-800 border-zinc-200"
                    )}
                    whileHover={{ scale: 1.1, x: -3 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    onClick={() => handleTap('left')}
                >
                    <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </motion.div>
            )}
            {step < totalSteps - 1 && (
                <motion.div
                    className={cn(
                        "p-2.5 rounded-full backdrop-blur-lg cursor-pointer ml-auto shadow-lg border",
                        isDarkMode
                            ? "bg-zinc-900/60 hover:bg-zinc-800/80 text-white border-zinc-800"
                            : "bg-white/60 hover:bg-white/80 text-zinc-800 border-zinc-200"
                    )}
                    whileHover={{ scale: 1.1, x: 3 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    onClick={() => handleTap('right')}
                >
                    <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                </motion.div>
            )}
        </div>
    );
}
