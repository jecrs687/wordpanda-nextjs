import { motion } from 'framer-motion';
import React from 'react';

interface WelcomeStepProps {
    goToStep: (step: number) => void;
    currentStep: number;
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
                <div className="relative w-20 h-20">
                    {/* Panda icon - stylized */}
                    <div className="absolute inset-0 bg-black dark:bg-white rounded-full flex items-center justify-center">
                        <span className="text-4xl text-white dark:text-black">🐼</span>
                    </div>
                    <div className="absolute -top-2 -left-1 w-5 h-5 bg-black dark:bg-white rounded-full"></div>
                    <div className="absolute -top-2 -right-1 w-5 h-5 bg-black dark:bg-white rounded-full"></div>
                </div>
            </motion.div>

            <motion.h1
                variants={itemVariants}
                className="text-4xl font-extrabold mb-4 text-black dark:text-white"
            >
                Welcome to <span className="text-emerald-500 dark:text-emerald-400">WordPanda</span>
            </motion.h1>

            <motion.p
                variants={itemVariants}
                className="text-lg text-zinc-700 dark:text-zinc-300 mb-8 max-w-md mx-auto"
            >
                Your journey to language mastery starts here. Fun, interactive, and personalized learning awaits you.
            </motion.p>

            <motion.div
                variants={itemVariants}
                className="space-y-4"
            >
                <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => goToStep(currentStep + 1)}
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-full 
                   shadow-lg hover:shadow-emerald-500/20 cursor-pointer inline-block"
                >
                    Begin Your Journey
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default WelcomeStep;