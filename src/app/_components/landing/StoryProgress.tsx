import { motion } from 'framer-motion';
import React from 'react';

interface StoryProgressProps {
    totalSteps: number;
    currentStep: number;
    progressStatus: number[];
    goToStep: (step: number) => void;
    statusBarHeight: number;
}

export const StoryProgress: React.FC<StoryProgressProps> = ({
    totalSteps,
    currentStep,
    progressStatus,
    goToStep,
    statusBarHeight,
}) => {
    return (
        <div
            className="absolute top-0 left-0 right-0 z-30 w-full px-3 pt-1 flex items-center justify-center"
            style={{ paddingTop: `${statusBarHeight + 10}px` }}
        >
            <div className="w-full max-w-3xl flex space-x-1.5">
                {Array.from({ length: totalSteps }).map((_, index) => (
                    <div
                        key={index}
                        className={`relative h-1.5 flex-1 rounded-full overflow-hidden backdrop-blur-sm
                            ${index === currentStep
                                ? 'bg-zinc-200/30 dark:bg-zinc-600/30'
                                : 'bg-zinc-200/20 dark:bg-zinc-700/20'}`}
                        onClick={() => goToStep(index)}
                    >
                        <motion.div
                            className={`h-full rounded-full ${index < currentStep
                                    ? 'bg-emerald-400 dark:bg-emerald-500'
                                    : index === currentStep
                                        ? 'bg-white dark:bg-white'
                                        : 'bg-zinc-400/30 dark:bg-zinc-500/30'
                                }`}
                            initial={{ width: index < currentStep ? '100%' : '0%' }}
                            animate={{
                                width: index < currentStep
                                    ? '100%'
                                    : index === currentStep
                                        ? `${progressStatus[index] * 100}%`
                                        : '0%'
                            }}
                            transition={{
                                duration: index === currentStep ? 0.1 : 0.3,
                                ease: index === currentStep ? "linear" : "easeOut"
                            }}
                        />

                        {/* Glow effect for active story */}
                        {index === currentStep && (
                            <motion.div
                                className="absolute inset-0 bg-white/30 dark:bg-white/20 rounded-full filter blur-sm"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0.6, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
