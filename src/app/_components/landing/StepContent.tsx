import { cn } from '@utils/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface StepContentProps {
    isDarkMode: boolean;
    step: number;
    currentStep: {
        id: string;
        Component: any;
    };
    goToStep: (step: number) => void;
    router: AppRouterInstance;
    windowWidth: number;
    windowHeight: number;
    totalSteps: number;
}

export function StepContent({
    isDarkMode,
    step,
    currentStep,
    goToStep,
    router,
    windowWidth,
    windowHeight,
    totalSteps
}: StepContentProps) {
    const { Component, id } = currentStep;

    return (
        <div className="absolute inset-0 flex items-center justify-center px-4 md:px-8 pointer-events-none">
            <motion.div
                className={cn(
                    "w-full max-w-4xl mx-auto relative overflow-hidden rounded-2xl md:rounded-3xl",
                    "backdrop-blur-md shadow-lg border",
                    isDarkMode
                        ? "bg-zinc-900/60 border-zinc-800/50"
                        : "bg-white/60 border-zinc-200/50",
                    "pointer-events-auto"
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    height: 'calc(100% - 160px)',
                    maxHeight: '700px',
                }}
            >
                <AnimatePresence mode="wait">
                    <Component
                        key={id}
                        goToStep={goToStep}
                        router={router}
                        windowWidth={windowWidth}
                        windowHeight={windowHeight}
                    />
                </AnimatePresence>

                {/* Step indicator dots - mobile only */}
                <motion.div
                    className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2 md:hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    {Array(totalSteps).fill(0).map((_, i) => (
                        <motion.div
                            key={i}
                            className={cn(
                                "w-2 h-2 rounded-full cursor-pointer transition-colors",
                                step === i
                                    ? isDarkMode ? "bg-green-500" : "bg-green-600"
                                    : isDarkMode ? "bg-zinc-700" : "bg-zinc-300"
                            )}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => goToStep(i)}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
}
