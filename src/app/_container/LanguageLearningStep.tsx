'use client';
import { motion } from 'framer-motion';
import React from 'react';
import { useTranslation } from "react-i18next";

interface LanguageLearningStepProps {
    goToStep: (step: number) => void;
    currentStep: number;
    totalSteps: number;
}

const LanguageLearningStep: React.FC<LanguageLearningStepProps> = ({ goToStep, currentStep }) => {
    const { t } = useTranslation();

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

    const languages = [
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'it', name: 'Italian' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' }
    ];

    // Floating animation for language badges
    const floatingVariants = (index: number) => ({
        animate: {
            y: [0, -8, 0],
            transition: {
                duration: 3 + index * 0.5,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    });

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
        >
            <motion.div
                variants={itemVariants}
                className="mb-8 relative flex justify-center"
            >
                <div className="relative w-full max-w-xs">
                    {/* Language badges floating around */}
                    <div className="relative h-40 flex justify-center items-center">
                        {languages.map((lang, index) => (
                            <motion.div
                                key={lang.code}
                                className={`absolute ${index % 2 === 0 ? 'bg-indigo-500 dark:bg-indigo-600' : 'bg-cyan-500 dark:bg-cyan-600'
                                    } text-white font-medium px-3 py-1.5 rounded-full shadow-md`}
                                style={{
                                    left: `${10 + (index * 30) % 80}%`,
                                    top: `${10 + (index * 25) % 80}%`,
                                }}
                                variants={floatingVariants(index)}
                                animate="animate"
                            >
                                {lang.name}
                            </motion.div>
                        ))}

                        {/* Central panda element */}
                        <motion.div
                            className="absolute w-20 h-20 bg-black dark:bg-white rounded-full z-10 flex items-center justify-center"
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <span className="text-3xl">🐼</span>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-4xl font-bold mb-4 text-black dark:text-white"
            >
                {t('onboarding.languageLearning.title')} <span className="text-indigo-500 dark:text-indigo-400">{t('onboarding.languageLearning.titleHighlight')}</span>
            </motion.h2>

            <motion.p
                variants={itemVariants}
                className="text-base md:text-lg text-zinc-700 dark:text-zinc-300 mb-6 max-w-md mx-auto"
            >
                {t('onboarding.languageLearning.description')}
            </motion.p>

            <motion.div
                variants={itemVariants}
                className="flex flex-wrap justify-center gap-2 mb-8"
            >
                {languages.slice(0, 4).map((lang, index) => (
                    <motion.div
                        key={lang.code}
                        className="px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 text-sm flex items-center"
                        whileHover={{
                            scale: 1.05,
                            backgroundColor: index % 2 === 0 ? 'rgba(99, 102, 241, 0.1)' : 'rgba(6, 182, 212, 0.1)',
                            borderColor: index % 2 === 0 ? 'rgb(99, 102, 241)' : 'rgb(6, 182, 212)'
                        }}
                    >
                        {lang.name}
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                variants={itemVariants}
                className="flex flex-col md:flex-row gap-3 justify-center"
            >
                <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => goToStep(currentStep + 1)}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium rounded-full 
                             shadow-lg inline-flex items-center justify-center space-x-2"
                >
                    <span>{t('common.discover')}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default LanguageLearningStep;