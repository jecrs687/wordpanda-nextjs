"use client";
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

type CardMovieSmallProps = {
    id: string;
    logoUrl: string;
    name: string;
    platform: string;
    language?: string;
    code?: string;
    languages?: string;
    badge?: ReactNode;
};

const CardMovieSmall = ({
    id,
    logoUrl,
    name,
    platform,
    language,
    code,
    languages,
    badge,
}: CardMovieSmallProps) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <Link href={`/movie/${id}${code ? `?code=${code}` : ''}`} passHref>
            <motion.div
                className={clsx(
                    "group overflow-hidden rounded-xl w-full h-full transition-all duration-300",
                    "backdrop-blur-md relative",
                    isDark ? "bg-gray-900/50 border border-gray-700" : "bg-white/80 border border-gray-100",
                    "shadow-lg hover:shadow-xl"
                )}
                whileHover={{
                    y: -5,
                    boxShadow: isDark ? '0 20px 25px -5px rgba(0, 0, 0, 0.5)' : '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
                whileTap={{ scale: 0.98 }}
            >
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-xl">
                    {logoUrl ? (
                        <Image
                            src={logoUrl}
                            alt={name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            priority
                        />
                    ) : (
                        <div className={clsx(
                            "flex items-center justify-center w-full h-full",
                            isDark ? "bg-gray-800" : "bg-gray-100"
                        )}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                            </svg>
                        </div>
                    )}

                    {/* Platform indicator */}
                    {platform && (
                        <div className="absolute top-2 right-2">
                            <motion.span
                                className={clsx(
                                    "py-1 px-2 rounded-md text-xs font-medium",
                                    isDark ? "bg-gray-800/80" : "bg-white/80",
                                    "backdrop-blur-md"
                                )}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                {platform}
                            </motion.span>
                        </div>
                    )}

                    {/* Custom badge display */}
                    {badge && (
                        <div className="absolute top-2 left-2 z-10">
                            {badge}
                        </div>
                    )}

                    {/* Gradient overlay for better text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="p-4">
                    <h3 className={clsx(
                        "font-bold mb-1 line-clamp-1",
                        isDark ? "text-white" : "text-gray-900"
                    )}>
                        {name}
                    </h3>

                    {(language || languages) && (
                        <div className="flex items-center">
                            <div className="flex-shrink-0 w-2 h-2 rounded-full mr-2 bg-emerald-400" />
                            <p className={clsx(
                                "text-sm line-clamp-1",
                                isDark ? "text-gray-300" : "text-gray-600"
                            )}>
                                {language || languages}
                            </p>
                        </div>
                    )}
                </div>

                {/* Play button overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/30 backdrop-blur-sm rounded-xl">
                    <motion.div
                        className="bg-emerald-500/80 rounded-full p-3"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </motion.div>
                </div>
            </motion.div>
        </Link>
    );
};

export default CardMovieSmall;
