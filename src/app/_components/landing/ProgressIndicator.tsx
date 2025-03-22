import { cn } from '@utils/utils';
import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
    totalSteps: number;
    currentStep: number;
    progressStatus: number[];
    goToStep: (step: number) => void;
    isDarkMode: boolean;
    statusBarHeight: number;
}

export function ProgressIndicator({
    totalSteps,
    currentStep,
    progressStatus,
    goToStep,
    isDarkMode,
    statusBarHeight
}: ProgressIndicatorProps) {
    return (
        <div
            className="absolute top-0 left-0 right-0 z-50 flex gap-1.5 p-4 sm:gap-2"
            style={{ paddingTop: `${Math.max(4 + (+statusBarHeight) * 2, 16)}px` }}
        >
            {Array(totalSteps).fill(0).map((_, i) => (
                <motion.div
                    key={i}
                    className={cn(
                        "h-1 sm:h-1.5 flex-1 rounded-full cursor-pointer overflow-hidden backdrop-blur-sm",
                        isDarkMode ? "bg-zinc-800/70" : "bg-zinc-200/70"
                    )}
                    onClick={() => goToStep(i)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <motion.div
                        className={cn(
                            "h-full rounded-full",
                            isDarkMode
                                ? "bg-green-600"
                                : "bg-green-500"
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressStatus[i] * 100}%` }}
                        transition={{ ease: 'linear' }}
                    />
                </motion.div>
            ))}
        </div>
    );
}
