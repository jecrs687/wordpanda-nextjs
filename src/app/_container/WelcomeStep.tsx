import { motion } from 'framer-motion';
import React from 'react';

interface WelcomeStepProps {
    goToStep: (step: number) => void;
    currentStep: number;
    totalSteps: number;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ goToStep, currentStep }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
        >
            <motion.div
                variants={itemVariants}
                className="mb-6 flex justify-center"
            >
                <div className="relative w-24 h-24 md:w-28 md:h-28">
                    {/* Panda face - stylized with CSS */}
                    <div className="absolute inset-0 bg-black dark:bg-white rounded-full flex items-center justify-center">
                        <div className="relative w-20 h-14">
                            {/* Eyes */}
                            <div className="absolute top-1 left-1 w-6 h-6 bg-white dark:bg-black rounded-full"></div>
                            <div className="absolute top-1 right-1 w-6 h-6 bg-white dark:bg-black rounded-full"></div>

                            {/* Eye pupils */}
                            <div className="absolute top-3 left-3 w-2 h-2 bg-black dark:bg-white rounded-full"></div>
                            <div className="absolute top-3 right-3 w-2 h-2 bg-black dark:bg-white rounded-full"></div>

                            {/* Nose */}
                            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-4 h-3 bg-zinc-800 dark:bg-zinc-300 rounded-full"></div>
                        </div>
                    </div>
                    {/* Ears */}
                    <div className="absolute -top-3 -left-1 w-8 h-8 bg-black dark:bg-white rounded-full"></div>
                    <div className="absolute -top-3 -right-1 w-8 h-8 bg-black dark:bg-white rounded-full"></div>
                </div>
            </motion.div>

            <motion.h1
                variants={itemVariants}
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-black dark:text-white"
            >
                Welcome to <span className="text-emerald-500 dark:text-emerald-400">WordPanda</span>
            </motion.h1>

            <motion.p
                variants={itemVariants}
                className="text-base md:text-lg text-zinc-700 dark:text-zinc-300 mb-8 max-w-md mx-auto"
            >
                Your journey to language mastery starts here. Fun, interactive, and personalized learning awaits you.
            </motion.p>

            <motion.div
                variants={itemVariants}
                className="space-y-4"
            >
                <motion.button
                    whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.25)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => goToStep(currentStep + 1)}
                    className="px-7 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-full 
                             shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 cursor-pointer inline-flex 
                             items-center space-x-2"
                >
                    <span>Start Your Journey</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default WelcomeStep;