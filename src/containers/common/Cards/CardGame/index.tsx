"use client";

import { ROUTES } from '@constants/ROUTES';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ActionButtons } from './components/ActionButtons';
import { CardHeader } from './components/CardHeader';
import { ProgressBar } from './components/ProgressBar';

type CardGameProps = {
    mediaId?: string | number;
    words: any[];
    language: string;
    languageName: string;
    mediaWords?: any[];
    totalWords: number;
    onClick?: () => void;
    isDisabled?: boolean;
};

export const CardGame = ({
    mediaId,
    words,
    language,
    languageName,
    mediaWords,
    totalWords,
    onClick,
    isDisabled = false,
}: CardGameProps) => {
    const router = useRouter();
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted ? theme === 'dark' : false;

    const handleClick = () => {
        if (isDisabled) return;

        if (onClick) {
            onClick();
        } else if (mediaId) {
            router.push(ROUTES.GAME_LIST(mediaId, language));
        }
    };

    const progressPercentage = mediaWords?.length
        ? Math.min(Math.round((mediaWords.length / totalWords) * 100), 100)
        : 0;

    if (!mounted) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25
            }}
            onClick={handleClick}
            className={`
                relative overflow-hidden rounded-2xl w-full max-w-sm mx-auto
                ${isDark
                    ? 'bg-gray-900/70 border border-gray-800/50 shadow-lg shadow-black/20'
                    : 'bg-white/90 border border-gray-100 shadow-xl shadow-gray-200/50'
                }
                backdrop-blur-md
                group
                ${isDisabled
                    ? 'opacity-60 cursor-not-allowed'
                    : 'cursor-pointer hover:shadow-xl hover:shadow-emerald-900/10'
                }
                transition-all duration-300 ease-out
            `}
        >
            {/* Panda-themed accent at the top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500/80 group-hover:bg-emerald-400 transition-colors duration-300" />

            <div className="relative z-10 p-5 sm:p-6">
                <CardHeader
                    language={language}
                    languageName={languageName}
                    isDark={isDark}
                />

                <div className="space-y-5 mt-5">
                    <ProgressBar
                        progressPercentage={progressPercentage}
                        mediaWordsCount={mediaWords?.length || 0}
                        totalWords={totalWords}
                        isDark={isDark}
                    />

                    <ActionButtons
                        languageName={languageName}
                        language={language}
                        isDisabled={isDisabled}
                        isDark={isDark}
                    />
                </div>
            </div>

            {/* Subtle panda-inspired decorative elements */}
            <div className={`
                absolute -bottom-8 -right-8 w-32 h-32 rounded-full 
                ${isDark ? 'bg-white/5' : 'bg-black/5'} blur-2xl
                group-hover:opacity-80 transition-opacity duration-500 ease-out
            `} />
            <div className={`
                absolute -top-5 -left-5 w-24 h-24 rounded-full 
                ${isDark ? 'bg-emerald-900/10' : 'bg-emerald-100/40'} blur-xl
                group-hover:opacity-100 transition-opacity duration-500 ease-out
            `} />
        </motion.div>
    );
};

export default CardGame;
