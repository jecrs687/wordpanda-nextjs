"use client";
import Button from '@core/Button';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type FeaturedCardProps = {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    languages: string[];
    ctaText?: string;
    url?: string;
};

const FeaturedCard = ({
    id,
    title,
    description,
    imageUrl,
    languages,
    ctaText = "Iniciar agora",
    url
}: FeaturedCardProps) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [isHovered, setIsHovered] = useState(false);

    const targetUrl = url || `/media/${id}`;

    return (
        <motion.div
            className={clsx(
                "rounded-2xl overflow-hidden relative",
                "transition-all duration-300",
                isDark ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-white to-gray-50",
                "border shadow-xl",
                isDark ? "border-gray-700" : "border-gray-200"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            {/* Background elements */}
            <div className={clsx(
                "absolute inset-0 overflow-hidden z-0",
                "opacity-20 dark:opacity-10"
            )}>
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full blur-2xl" />
                <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-2xl" />
            </div>

            <div className="flex flex-col md:flex-row h-full">
                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col justify-center md:w-1/2 z-10">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className={clsx(
                            "text-2xl md:text-3xl font-bold mb-3",
                            isDark ? "text-white" : "text-gray-900"
                        )}>
                            {title}
                        </h2>

                        <p className={clsx(
                            "mb-6 text-sm md:text-base",
                            isDark ? "text-gray-300" : "text-gray-600"
                        )}>
                            {description}
                        </p>

                        {languages.length > 0 && (
                            <div className="mb-6">
                                <p className={clsx(
                                    "text-xs uppercase font-semibold mb-2",
                                    isDark ? "text-gray-400" : "text-gray-500"
                                )}>
                                    Idiomas disponíveis
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {languages.map((lang, index) => (
                                        <span
                                            key={index}
                                            className={clsx(
                                                "px-2 py-1 rounded-full text-xs",
                                                isDark
                                                    ? "bg-gray-800 text-emerald-400 border border-gray-700"
                                                    : "bg-gray-100 text-emerald-600 border border-gray-200"
                                            )}
                                        >
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Link href={targetUrl} passHref>
                            <Button
                                variety="primary"
                                size="medium"
                                className={clsx(
                                    isDark
                                        ? "bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500"
                                        : "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400",
                                    "text-white"
                                )}
                                leftIcon={
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                }
                            >
                                {ctaText}
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                {/* Image */}
                <motion.div
                    className="relative md:w-1/2 h-64 md:h-auto overflow-hidden"
                    initial={{ opacity: 0.8, scale: 1 }}
                    animate={{
                        opacity: 1,
                        scale: isHovered ? 1.05 : 1,
                        transition: { duration: 0.5 }
                    }}
                >
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                    />

                    <div className={clsx(
                        "absolute inset-0 bg-gradient-to-l",
                        isDark
                            ? "from-transparent via-gray-900/40 to-gray-900/80"
                            : "from-transparent via-white/40 to-white/80",
                        "md:block hidden"
                    )} />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default FeaturedCard;
