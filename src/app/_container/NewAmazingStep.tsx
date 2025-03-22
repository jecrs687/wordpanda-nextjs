import { motion } from 'framer-motion';
import React from 'react';

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

    // Feature cards
    const features = [
        {
            id: 1,
            title: 'Interactive Games',
            description: 'Fun games that make learning effortless',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 5H7a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4V9a4 4 0 0 0-4-4Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M5 12h.01M19 12h.01"></path>
                </svg>
            ),
            color: 'from-rose-500 to-amber-500'
        },
        {
            id: 2,
            title: 'Progress Tracking',
            description: 'Monitor your improvement over time',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18"></path>
                    <path d="m19 9-5 5-4-4-3 3"></path>
                </svg>
            ),
            color: 'from-emerald-500 to-teal-500'
        },
        {
            id: 3,
            title: 'Social Learning',
            description: 'Connect with friends and learn together',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
            ),
            color: 'from-blue-500 to-violet-500'
        }
    ];

    // Card variants
    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: (i: number) => ({
            y: 0,
            opacity: 1,
            transition: {
                delay: 0.3 + (i * 0.2),
                duration: 0.5,
                ease: "easeOut"
            }
        }),
        hover: {
            y: -5,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
        >
            <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-4xl font-bold mb-3 text-black dark:text-white"
            >
                <span className="text-rose-500 dark:text-rose-400">Amazing</span> Features
            </motion.h2>

            <motion.p
                variants={itemVariants}
                className="text-base md:text-lg text-zinc-700 dark:text-zinc-300 mb-8 max-w-md mx-auto"
            >
                Discover all the innovative tools and features we've created to make your language learning journey exceptional.
            </motion.p>

            <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            >
                {features.map((feature, i) => (
                    <motion.div
                        key={feature.id}
                        custom={i}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        className="bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-xl p-5 border border-zinc-200/30 dark:border-zinc-700/30 shadow-md"
                    >
                        <div className={`w-12 h-12 mb-4 rounded-full bg-gradient-to-r ${feature.color} mx-auto flex items-center justify-center text-white`}>
                            {feature.icon}
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">{feature.title}</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm">{feature.description}</p>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 justify-center"
            >
                <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(244, 63, 94, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => goToStep(currentStep + 1)}
                    className="px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-medium rounded-full 
                             shadow-lg inline-flex items-center justify-center space-x-2"
                >
                    <span>Get Started Now</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default NewAmazingStep;
