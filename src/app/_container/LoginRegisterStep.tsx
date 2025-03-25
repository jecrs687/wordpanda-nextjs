'use client';
import { ROUTES } from '@constants/ROUTES';
import { useI18n } from "@providers/TranslationProvider";
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useTranslation } from "react-i18next";

interface LoginRegisterStepProps {
    goToStep: (step: number) => void;
    currentStep: number;
    totalSteps: number;
    router: any;
}

const LoginRegisterStep: React.FC<LoginRegisterStepProps> = ({ goToStep, currentStep, router }) => {
    const [hoveredButton, setHoveredButton] = useState<string | null>(null);
    const { language } = useI18n();
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

    // Bamboo animation for decoration
    const bambooVariants = {
        animate: {
            height: [60, 70, 60],
            transition: {
                duration: 3,
                repeat: Infinity,
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
                className="mb-8 relative flex justify-center"
            >
                {/* Decorative panda face icon */}
                <div className="relative w-20 h-20 mb-4 mx-auto">
                    {/* Panda face */}
                    <div className="absolute inset-0 bg-black dark:bg-white rounded-full flex items-center justify-center">
                        <div className="relative w-16 h-11">
                            {/* Eyes */}
                            <div className="absolute top-0 left-1 w-5 h-5 bg-white dark:bg-black rounded-full"></div>
                            <div className="absolute top-0 right-1 w-5 h-5 bg-white dark:bg-black rounded-full"></div>

                            {/* Eye pupils */}
                            <div className="absolute top-2 left-3 w-1.5 h-1.5 bg-black dark:bg-white rounded-full"></div>
                            <div className="absolute top-2 right-3 w-1.5 h-1.5 bg-black dark:bg-white rounded-full"></div>

                            {/* Nose */}
                            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-zinc-800 dark:bg-zinc-300 rounded-full"></div>
                        </div>
                    </div>
                    {/* Ears */}
                    <div className="absolute -top-3 -left-1 w-7 h-7 bg-black dark:bg-white rounded-full"></div>
                    <div className="absolute -top-3 -right-1 w-7 h-7 bg-black dark:bg-white rounded-full"></div>
                </div>

                {/* Decorative bamboo elements */}
                <div className="absolute -left-8 bottom-0 w-2 bg-emerald-600 dark:bg-emerald-500 rounded-full opacity-50">
                    <motion.div variants={bambooVariants} animate="animate" style={{ height: '60px' }}></motion.div>
                </div>
                <div className="absolute -right-8 bottom-0 w-2 bg-emerald-600 dark:bg-emerald-500 rounded-full opacity-50">
                    <motion.div variants={bambooVariants} animate="animate" style={{ height: '60px', animationDelay: '1.5s' }}></motion.div>
                </div>
            </motion.div>

            <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-4xl font-bold mb-4 text-black dark:text-white"
            >
                {t('onboarding.login.title')} <span className="text-emerald-500 dark:text-emerald-400">{t('onboarding.login.titleHighlight')}</span>?
            </motion.h2>

            <motion.p
                variants={itemVariants}
                className="text-base md:text-lg text-zinc-700 dark:text-zinc-300 mb-8 max-w-md mx-auto"
            >
                {t('onboarding.login.description')}
            </motion.p>

            <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onMouseEnter={() => setHoveredButton('register')}
                    onMouseLeave={() => setHoveredButton(null)}
                    onClick={() => router.push(ROUTES.REGISTER())}
                    className="relative px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-full 
                             shadow-lg inline-flex items-center justify-center space-x-2 w-full sm:w-auto min-w-[180px]"
                >
                    <span>{t('onboarding.login.signup')}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>

                    {/* Decorative highlight effect */}
                    {hoveredButton === 'register' && (
                        <motion.div
                            className="absolute inset-0 rounded-full bg-white opacity-20"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1.2, opacity: 0 }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                        />
                    )}
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onMouseEnter={() => setHoveredButton('login')}
                    onMouseLeave={() => setHoveredButton(null)}
                    onClick={() => router.push(ROUTES.LOGIN())}
                    className="relative px-8 py-3.5 border-2 border-zinc-200 dark:border-zinc-700 bg-white/10 dark:bg-black/10 backdrop-blur-sm 
                             text-black dark:text-white font-medium rounded-full inline-flex items-center justify-center space-x-2 w-full sm:w-auto min-w-[180px]"
                >
                    <span>{t('onboarding.login.login')}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                        <polyline points="10 17 15 12 10 7"></polyline>
                        <line x1="15" y1="12" x2="3" y2="12"></line>
                    </svg>

                    {/* Decorative highlight effect */}
                    {hoveredButton === 'login' && (
                        <motion.div
                            className="absolute inset-0 rounded-full bg-zinc-400 dark:bg-zinc-300 opacity-10"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1.2, opacity: 0 }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                        />
                    )}
                </motion.button>
            </motion.div>

            <motion.div
                variants={itemVariants}
                className="mt-8 text-sm text-zinc-600 dark:text-zinc-400"
            >
                <p>{t('onboarding.login.terms')}</p>
            </motion.div>
        </motion.div >
    );
};

export default LoginRegisterStep;