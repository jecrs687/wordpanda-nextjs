'use client';
import { motion } from 'framer-motion';
import React from 'react';
import { useTranslation } from "react-i18next";

export const PandaAssistant: React.FC = () => {
    const { t } = useTranslation();

    // Pulse animation for panda avatar
    const pulseVariants = {
        animate: {
            scale: [1, 1.05, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="flex items-center mb-4 justify-center md:justify-start">
            <div className="relative mr-3">
                <motion.div
                    className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border-2 border-emerald-500 dark:border-emerald-400 flex items-center justify-center overflow-hidden"
                    variants={pulseVariants}
                    animate="animate"
                >
                    {/* Panda-themed avatar */}
                    <div className="relative w-full h-full">
                        {/* Panda ears */}
                        <div className="absolute top-0 left-1 w-3 h-3 rounded-full bg-black dark:bg-zinc-800"></div>
                        <div className="absolute top-0 right-1 w-3 h-3 rounded-full bg-black dark:bg-zinc-800"></div>

                        {/* Panda eyes */}
                        <div className="absolute top-3 left-2 w-2 h-2 rounded-full bg-black dark:bg-zinc-800"></div>
                        <div className="absolute top-3 right-2 w-2 h-2 rounded-full bg-black dark:bg-zinc-800"></div>

                        {/* Panda nose */}
                        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-2 h-1.5 rounded-full bg-black dark:bg-zinc-800"></div>
                    </div>
                </motion.div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white dark:border-zinc-900"></div>
            </div>
            <div>
                <h3 className="font-semibold text-sm sm:text-base text-black dark:text-white">{t('onboarding.aiAssistance.assistantName')}</h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">{t('onboarding.aiAssistance.assistantStatus')}</p>
            </div>
        </div>
    );
};
