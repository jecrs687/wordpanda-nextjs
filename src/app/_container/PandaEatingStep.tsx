import { motion } from 'framer-motion';
import React from 'react';

interface PandaEatingStepProps {
    goToStep: (step: number) => void;
    currentStep: number;
    totalSteps: number;
}

const PandaEatingStep: React.FC<PandaEatingStepProps> = ({ goToStep, currentStep }) => {
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

    // Bamboo animation
    const bambooVariants = {
        initial: { height: 0 },
        animate: {
            height: 120,
            transition: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse" as const,
                ease: "easeInOut"
            }
        }
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
                className="mb-8 relative h-40 flex justify-center"
            >
                {/* Bamboo stalks */}
                <div className="relative w-full max-w-[200px] h-full flex justify-center items-end space-x-3">
                    <motion.div
                        variants={bambooVariants}
                        initial="initial"
                        animate="animate"
                        className="w-3 bg-emerald-600 dark:bg-emerald-500 rounded-full origin-bottom"
                        style={{ animationDelay: "0ms" }}
                    />
                    <motion.div
                        variants={bambooVariants}
                        initial="initial"
                        animate="animate"
                        className="w-3 bg-emerald-600 dark:bg-emerald-500 rounded-full origin-bottom"
                        style={{ animationDelay: "500ms" }}
                    />
                    <motion.div
                        variants={bambooVariants}
                        initial="initial"
                        animate="animate"
                        className="w-3 bg-emerald-600 dark:bg-emerald-500 rounded-full origin-bottom"
                        style={{ animationDelay: "1000ms" }}
                    />

                    {/* Bamboo leaves */}
                    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 transform -rotate-45">
                        <div className="w-12 h-6 bg-emerald-400 dark:bg-emerald-300 rounded-full -ml-12"></div>
                    </div>
                    <div className="absolute bottom-40 left-1/2 -translate-x-1/2 transform rotate-45">
                        <div className="w-12 h-6 bg-emerald-400 dark:bg-emerald-300 rounded-full ml-12"></div>
                    </div>

                    {/* Panda hand reaching */}
                    <motion.div
                        className="absolute -right-8 bottom-8"
                        animate={{
                            x: [-5, 5, -5],
                            rotate: [-2, 2, -2]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            repeatType: "mirror"
                        }}
                    >
                        <div className="w-12 h-12 bg-white dark:bg-gray-100 rounded-full"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-black dark:bg-gray-800 rounded-full opacity-40"></div>
                    </motion.div>
                </div>
            </motion.div>

            <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-4xl font-bold mb-4 text-black dark:text-white"
            >
                Feed Your <span className="text-emerald-500 dark:text-emerald-400">Knowledge</span>
            </motion.h2>

            <motion.p
                variants={itemVariants}
                className="text-base md:text-lg text-zinc-700 dark:text-zinc-300 mb-6 max-w-md mx-auto"
            >
                Just like pandas need bamboo, your mind needs consistent practice to grow. With WordPanda, language learning becomes a daily habit that nourishes your skills.
            </motion.p>

            <motion.div
                variants={itemVariants}
                className="flex flex-col md:flex-row gap-3 justify-center"
            >
                <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "#0369a1" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => goToStep(currentStep + 1)}
                    className="px-6 py-2.5 bg-sky-600 text-white font-medium rounded-full 
                             shadow-md inline-flex items-center justify-center space-x-2"
                >
                    <span>Continue</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default PandaEatingStep;