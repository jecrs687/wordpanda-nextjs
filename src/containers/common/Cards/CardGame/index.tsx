"use client";

import { ROUTES } from '@constants/ROUTES';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
    const isDark = theme === "dark";
    const [mounted, setMounted] = useState(false);

    // After mounting, we have access to the theme
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleClick = () => {
        if (isDisabled) return;

        if (onClick) {
            onClick();
        } else {
            if (mediaId) {
                router.push(
                    `${ROUTES.GAME_LIST()}?mediaId=${mediaId}&language=${language}`
                );
            }
        }
    };

    const progressPercentage = mediaWords?.length
        ? Math.min(Math.round((mediaWords.length / totalWords) * 100), 100)
        : 0;

    if (!mounted) return null;

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 300,
                damping: 20
            }}
            onClick={handleClick}
            className={`
        relative overflow-hidden rounded-xl shadow-xl 
        ${isDark
                    ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/90 border border-gray-700/50'
                    : 'bg-gradient-to-br from-white/90 to-zinc-100/90 border border-zinc-200/50'}
        backdrop-blur-md
        ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-2xl'}
        transition-all duration-300 ease-in-out
      `}
        >
            <div className="relative z-10 p-5">
                <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 rounded-lg shadow-md">
                        <div className={`
              p-2 rounded-md 
              ${isDark ? 'bg-gray-800' : 'bg-white'}
            `}>
                            <motion.div
                                animate={{ rotate: [0, -10, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                            >
                                <Image
                                    src="/assets/logo.png"
                                    alt="WordPanda"
                                    width={30}
                                    height={30}
                                    className="rounded-md"
                                />
                            </motion.div>
                        </div>
                    </div>

                    <div className="ml-3">
                        <h3 className={`
              font-bold text-lg
              ${isDark ? 'text-white' : 'text-gray-800'}
            `}>
                            {languageName}
                        </h3>
                        <p className={`
              text-xs font-medium uppercase tracking-wider
              ${isDark ? 'text-zinc-400' : 'text-zinc-500'}
            `}>
                            {language}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className={`
                text-sm font-medium
                ${isDark ? 'text-zinc-300' : 'text-zinc-700'}
              `}>
                                Palavras aprendidas
                            </span>
                            <span className={`
                text-sm font-semibold
                ${isDark
                                    ? 'text-emerald-400'
                                    : 'text-emerald-600'
                                }
              `}>
                                {mediaWords?.length || 0}/{totalWords}
                            </span>
                        </div>

                        <div className={`
              w-full h-2 rounded-full overflow-hidden
              ${isDark ? 'bg-gray-700' : 'bg-gray-200'}
            `}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={`
              w-full py-2.5 px-4 rounded-lg font-medium text-sm 
              ${isDark
                                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-800/30'
                                : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                            }
              transition-all duration-200
            `}
                        disabled={isDisabled}
                    >
                        Estudar {languageName}
                    </motion.button>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-400/20 to-indigo-600/20 rounded-full blur-3xl -z-10 transform translate-x-1/4 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-cyan-400/20 to-purple-600/20 rounded-full blur-3xl -z-10 transform -translate-x-1/4 translate-y-1/3" />
        </motion.div>
    );
};

export default CardGame;
