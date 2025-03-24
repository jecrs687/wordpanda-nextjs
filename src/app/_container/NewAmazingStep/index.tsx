import { motion } from 'framer-motion';
import React from 'react';
import FeatureCard from './components/FeatureCard';
import PandaAccent from './components/PandaAccent';

interface NewAmazingStepProps {
    goToStep: (step: number) => void;
    currentStep: number;
    totalSteps: number;
}

const NewAmazingStep: React.FC<NewAmazingStepProps> = ({ goToStep, currentStep }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const features = [
        {
            id: 1,
            title: 'Interactive Games',
            description: 'Fun games that make learning effortless',
            icon: 'game-controller',
            color: 'bg-zinc-900 dark:bg-white'
        },
        {
            id: 2,
            title: 'Progress Tracking',
            description: 'Monitor your learning journey over time',
            icon: 'bar-chart',
            color: 'bg-zinc-900 dark:bg-white'
        },
        {
            id: 3,
            title: 'Social Learning',
            description: 'Connect with friends and learn together',
            icon: 'users',
            color: 'bg-zinc-900 dark:bg-white'
        }
    ];

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative text-center px-1 sm:px-2 md:px-8 overflow-hidden max-h-[85vh] overflow-y-auto"
        >
            {/* Decorative panda accents */}
            <PandaAccent />

            <motion.div className="relative z-10">
                <motion.h2
                    variants={itemVariants}
                    className="text-xl sm:text-2xl md:text-4xl font-bold mb-1 sm:mb-2 md:mb-3 text-black dark:text-white"
                >
                    <span className="relative inline-block">
                        Amazing
                        <motion.span
                            className="absolute -bottom-1 left-0 w-full h-1 bg-emerald-400 dark:bg-emerald-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ delay: 0.7, duration: 0.7 }}
                        />
                    </span>
                    {' '}Features
                </motion.h2>

                <motion.p
                    variants={itemVariants}
                    className="text-xs sm:text-sm md:text-base text-zinc-700 dark:text-zinc-300 mb-3 sm:mb-5 md:mb-8 max-w-md mx-auto"
                >
                    Discover tools we've created to make your language learning journey exceptional.
                </motion.p>

                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8 max-w-3xl mx-auto"
                >
                    {features.map((feature, i) => (
                        <FeatureCard
                            key={feature.id}
                            feature={feature}
                            index={i}
                        />
                    ))}
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="flex justify-center mb-2"
                >
                    <motion.button
                        whileHover={{ scale: 1.03, backgroundColor: "#000000", color: "#ffffff" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => goToStep(currentStep + 1)}
                        className="px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-black dark:bg-white text-white dark:text-black 
                            font-medium rounded-full shadow-lg inline-flex items-center justify-center space-x-1 sm:space-x-2
                            transition-all duration-300 border border-transparent hover:border-emerald-400
                            dark:hover:border-emerald-500"
                    >
                        <span className="text-xs sm:text-sm md:text-base">Start Learning</span>
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </motion.button>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default NewAmazingStep;
