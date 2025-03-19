"use client";
import { ROUTES } from '@/src/constants/ROUTES';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useState } from 'react';

type LanguageCardProps = {
    id: string;
    language: string;
    code: string;
    wordsNumber: number;
    totalWordsNumber: number;
};

const LanguageCard = ({ id, language, code, wordsNumber, totalWordsNumber }: LanguageCardProps) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [isHovered, setIsHovered] = useState(false);
    // Calculate progress percentage
    const progress = totalWordsNumber > 0 ? Math.min((wordsNumber / totalWordsNumber) * 100, 100) : 0;
    const formattedProgress = progress.toFixed(0);

    // Flag emoji based on language code
    const getFlagEmoji = (code: string) => {
        // Some common language codes to emoji flags
        const languageToFlag: Record<string, string> = {
            'en': '🇬🇧',
            'es': '🇪🇸',
            'fr': '🇫🇷',
            'de': '🇩🇪',
            'it': '🇮🇹',
            'pt': '🇵🇹',
            'br': '🇧🇷',
            'ru': '🇷🇺',
            'cn': '🇨🇳',
            'jp': '🇯🇵',
        };

        return languageToFlag[code.toLowerCase()] || '🌐';
    };

    // Get color based on progress
    const getProgressColor = (progress: number) => {
        if (progress > 80) return "emerald";
        if (progress > 50) return "green";
        if (progress > 25) return "amber";
        return "indigo";
    };

    const progressColor = getProgressColor(progress);

    return (
        <Link href={ROUTES.LANGUAGE_DETAILS(id)} passHref>
            <motion.div
                className={clsx(
                    "overflow-hidden rounded-xl h-full relative group",
                    "backdrop-blur-md transition-all duration-300",
                    isDark ?
                        "bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/80" :
                        "bg-gradient-to-br from-white/90 to-gray-50/80 border-gray-100/80",
                    "border-2 shadow-lg hover:shadow-xl",
                    isHovered && `border-${progressColor}-400/50`
                )}
                whileHover={{
                    y: -8,
                    boxShadow: isDark
                        ? '0 20px 30px -10px rgba(0, 0, 0, 0.5)'
                        : '0 20px 30px -10px rgba(0, 0, 0, 0.15)'
                }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
                <div className="p-6 relative z-10">
                    {/* Language flag and name */}
                    <div className="flex items-center gap-3 mb-5">
                        <motion.div
                            className={clsx(
                                "text-4xl",
                                "transition-transform duration-500",
                                isHovered && "scale-110"
                            )}
                            role="img"
                            aria-label={`${language} flag`}
                            animate={{ rotate: isHovered ? [0, -5, 5, -5, 5, 0] : 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {getFlagEmoji(code)}
                        </motion.div>
                        <div>
                            <h3 className={clsx(
                                "font-bold text-xl",
                                isDark ? "text-white" : "text-gray-900"
                            )}>
                                {language}
                            </h3>
                            <p className={clsx(
                                "text-sm",
                                isDark ? "text-gray-400" : "text-gray-600"
                            )}>
                                {code.toUpperCase()}
                            </p>
                        </div>
                    </div>

                    {/* Progress information */}
                    <div className="mb-4">
                        <div className="flex justify-between mb-2">
                            <span className={clsx(
                                "text-sm font-medium",
                                isDark ? "text-gray-300" : "text-gray-700"
                            )}>
                                Seu progresso
                            </span>
                            <motion.span
                                className={clsx(
                                    "text-sm font-semibold",
                                    `text-${progressColor}-500`
                                )}
                                animate={{
                                    scale: isHovered ? [1, 1.1, 1] : 1,
                                }}
                                transition={{ duration: 0.5 }}
                            >
                                {formattedProgress}%
                            </motion.span>
                        </div>

                        {/* Progress bar with animation */}
                        <div className={clsx(
                            "w-full h-2.5 rounded-full overflow-hidden",
                            isDark ? "bg-gray-700/50" : "bg-gray-200/70"
                        )}>
                            <motion.div
                                className={clsx(
                                    "h-full rounded-full",
                                    `bg-${progressColor}-500`
                                )}
                                initial={{ width: '0%' }}
                                animate={{
                                    width: `${progress}%`,
                                    transition: {
                                        duration: 1.5,
                                        ease: "easeOut",
                                        delay: 0.2
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Word count with visual enhancement */}
                    <div className={clsx(
                        "flex justify-between items-center p-3 rounded-lg transition-colors",
                        isDark ?
                            "bg-gray-800/70 text-gray-300 border border-gray-700/50" :
                            "bg-gray-100/70 text-gray-700 border border-gray-200/50"
                    )}>
                        <div className="flex flex-col">
                            <span className="text-xs opacity-80">Palavras aprendidas</span>
                            <span className="text-sm font-bold">{wordsNumber} / {totalWordsNumber}</span>
                        </div>
                        <motion.div
                            className={clsx(
                                "w-8 h-8 rounded-full flex items-center justify-center text-white",
                                `bg-${progressColor}-500`
                            )}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                            </svg>
                        </motion.div>
                    </div>
                </div>

                {/* Visual enhancement - subtle patterns and decoration */}
                <div className={clsx(
                    "absolute inset-0 opacity-5 pointer-events-none -z-0",
                    "bg-grid"
                )}></div>

                <motion.div
                    className={clsx(
                        "absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-10 z-0",
                        `bg-${progressColor}-500`
                    )}
                    animate={{
                        scale: isHovered ? [1, 1.2, 1.1] : 1,
                        opacity: isHovered ? 0.2 : 0.1,
                    }}
                    transition={{ duration: 1, repeat: isHovered ? Infinity : 0, repeatType: "reverse" }}
                ></motion.div>
            </motion.div>
        </Link>
    );
};

export default LanguageCard;
