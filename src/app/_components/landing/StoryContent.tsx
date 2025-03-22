import { motion } from 'framer-motion';
import React from 'react';

interface StoryContentProps {
    Component: React.ComponentType<any>;
    step: number;
    goToStep: (step: number) => void;
    router: any;
    totalSteps: number;
}

export const StoryContent: React.FC<StoryContentProps> = ({
    Component,
    step,
    goToStep,
    router,
    totalSteps,
}) => {
    const contentVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0,
        }),
    };

    return (
        <motion.div
            className="absolute inset-0 flex items-center justify-center px-4 md:px-8 py-20 z-0"
            custom={step}
            initial="enter"
            animate="center"
            exit="exit"
            variants={contentVariants}
            transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
            }}
        >
            <div className="w-full max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto">
                <div className="relative backdrop-blur-md bg-white/5 dark:bg-black/5 rounded-3xl p-6 md:p-8 
                                border border-zinc-100/20 dark:border-zinc-800/20 overflow-hidden
                                shadow-[0_4px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
                    {/* Glassmorphism reflections */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-[400px] -left-[300px] w-[600px] h-[600px] rounded-full 
                                      bg-gradient-to-br from-white/5 to-transparent dark:from-white/10 dark:to-transparent transform -rotate-12" />
                        <div className="absolute -bottom-[400px] -right-[300px] w-[600px] h-[600px] rounded-full 
                                      bg-gradient-to-br from-white/5 to-transparent dark:from-white/10 dark:to-transparent transform rotate-12" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                        <Component
                            goToStep={goToStep}
                            router={router}
                            currentStep={step}
                            totalSteps={totalSteps}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
