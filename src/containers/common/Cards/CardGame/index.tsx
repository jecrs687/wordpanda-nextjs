"use client";

import { ROUTES } from '@constants/ROUTES';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
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
            router.push(`${ROUTES.GAME_LIST()}?mediaId=${mediaId}&language=${language}`);
        }
    };

    const progressPercentage = mediaWords?.length
        ? Math.min(Math.round((mediaWords.length / totalWords) * 100), 100)
        : 0;

    if (!mounted) return null;

    // Determine which color scheme to use based on language
    // This creates variety in the cards while maintaining design consistency
    const colorSchemes = [
        { primary: 'from-emerald-500 to-cyan-500', accent: 'emerald', glow: 'emerald-500/20' },
        { primary: 'from-indigo-500 to-violet-500', accent: 'indigo', glow: 'indigo-500/20' },
        { primary: 'from-cyan-500 to-blue-500', accent: 'blue', glow: 'blue-500/20' },
        { primary: 'from-purple-500 to-pink-500', accent: 'purple', glow: 'purple-500/20' },
    ];

    // Use hash of language name to consistently select a color scheme
    const hash = [...language].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorScheme = colorSchemes[hash % colorSchemes.length];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25
            }}
            onClick={handleClick}
            className={`
        relative overflow-hidden rounded-2xl 
        ${isDark
                    ? 'bg-gray-800/70 border border-gray-700/50 shadow-lg shadow-black/20'
                    : 'bg-white/90 border border-gray-100 shadow-xl shadow-gray-200/50'
                }
        backdrop-blur-md
        group
        ${isDisabled
                    ? 'opacity-60 cursor-not-allowed'
                    : 'cursor-pointer hover:shadow-2xl hover:shadow-' + colorScheme.glow
                }
        transition-all duration-500 ease-out
      `}
        >
            {/* Animated highlight effect at the top */}
            <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colorScheme.primary} 
          opacity-80 group-hover:opacity-100 transition-opacity duration-300`}
            />

            <div className="relative z-10 p-6">
                <div className="flex items-center mb-5">
                    <div className={`
            rounded-xl overflow-hidden bg-gradient-to-br ${colorScheme.primary}
            shadow-lg
          `}>
                        <div className={`p-2 ${isDark ? 'bg-gray-800/90' : 'bg-white/90'} m-0.5 rounded-lg`}>
                            <motion.div
                                animate={{ rotate: [0, 5, 0, -5, 0] }}
                                transition={{ repeat: Infinity, repeatDelay: 5, duration: 2 }}
                                className="relative w-10 h-10"
                            >
                                <Image
                                    src={`/assets/flags/${language.toLowerCase()}.svg`}
                                    alt={languageName}
                                    fill
                                    className="object-cover rounded"
                                />
                            </motion.div>
                        </div>
                    </div>

                    <div className="ml-4">
                        <h3 className={`
              font-bold text-xl
              ${isDark ? 'text-white' : 'text-gray-800'}
            `}>
                            {languageName}
                        </h3>
                        <p className={`
              text-xs font-medium tracking-wide uppercase
              ${isDark ? 'text-gray-400' : 'text-gray-500'}
            `}>
                            {language}
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Stats bar */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className={`
                text-sm font-medium
                ${isDark ? 'text-gray-300' : 'text-gray-600'}
              `}>
                                Palavras aprendidas
                            </span>
                            <span className={`
                text-sm font-bold text-${colorScheme.accent}-500
              `}>
                                {mediaWords?.length || 0}/{totalWords}
                            </span>
                        </div>

                        <div className={`
              w-full h-2 rounded-full overflow-hidden
              ${isDark ? 'bg-gray-700/70' : 'bg-gray-200/70'}
            `}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{
                                    duration: 1.2,
                                    delay: 0.3,
                                    ease: "easeOut"
                                }}
                                className={`h-full bg-gradient-to-r ${colorScheme.primary}`}
                            />
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-3">
                        <motion.button
                            whileHover={{ scale: 1.03, y: -1 }}
                            whileTap={{ scale: 0.97 }}
                            className={`
                w-full py-3 rounded-xl font-semibold text-sm
                bg-gradient-to-r ${colorScheme.primary} 
                text-white
                ${isDark
                                    ? `shadow-lg shadow-${colorScheme.accent}-900/20`
                                    : `shadow-md shadow-${colorScheme.accent}-500/20`
                                }
                transition-all duration-300 ease-out
                hover:shadow-xl
                group-hover:shadow-lg
                flex items-center justify-center
              `}
                            disabled={isDisabled}
                        >
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 3v18l14-9L5 3z" fill="currentColor" />
                            </svg>
                            Estudar {languageName}
                        </motion.button>

                        <Link
                            href={`/languages/${language}`}
                            className={`
                w-full py-2.5 rounded-xl font-medium text-sm
                flex items-center justify-center
                ${isDark
                                    ? `text-${colorScheme.accent}-400 bg-${colorScheme.accent}-900/20 hover:bg-${colorScheme.accent}-800/30`
                                    : `text-${colorScheme.accent}-600 bg-${colorScheme.accent}-50 hover:bg-${colorScheme.accent}-100/70`
                                }
                transition-colors duration-300
              `}
                        >
                            Ver detalhes
                            <svg className="w-3.5 h-3.5 ml-1.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Decorative background elements */}
            <div className={`
        absolute -bottom-10 -right-10 w-40 h-40 rounded-full 
        bg-gradient-to-tl ${colorScheme.primary} opacity-10 blur-3xl
        group-hover:opacity-20 transition-opacity duration-500 ease-out
      `} />
            <div className={`
        absolute -top-5 -left-5 w-24 h-24 rounded-full 
        bg-gradient-to-br ${colorScheme.primary} opacity-5 blur-xl
        group-hover:opacity-10 transition-opacity duration-500 ease-out
      `} />
        </motion.div>
    );
};

export default CardGame;
