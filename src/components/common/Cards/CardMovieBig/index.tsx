"use client";
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type CardMovieBigProps = {
    id: string;
    logoUrl: string;
    name: string;
    languages: string;
    index: number;
};

const CardMovieBig = ({
    id,
    logoUrl,
    name,
    languages,
    index,
}: CardMovieBigProps) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [isHovered, setIsHovered] = useState(false);

    // Calculate delay for staggered animations
    const animationDelay = index * 0.05;

    // Format languages for display
    const languageArray = languages.split(',');
    const primaryLanguage = languageArray[0];
    const additionalLanguages = languageArray.length > 1 ? languageArray.length - 1 : 0;

    return (
        <Link href={`/media/${id}`} passHref>
            <motion.div
                className={clsx(
                    "group overflow-hidden rounded-2xl w-full h-full",
                    "relative transition-all duration-300",
                    isDark ? "bg-gray-900/50" : "bg-white/80",
                    "backdrop-blur-lg border-2",
                    isDark ?
                        isHovered ? "border-emerald-500/30" : "border-gray-700/80" :
                        isHovered ? "border-emerald-500/30" : "border-gray-100/80",
                    "shadow-lg"
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: animationDelay }
                }}
                whileHover={{
                    y: -8,
                    scale: 1.02,
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
            >
                {/* Main Image with animated zoom on hover */}
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                    {logoUrl ? (
                        <Image
                            src={logoUrl}
                            alt={name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className={clsx(
                                "object-cover transition-all duration-700",
                                isHovered && "scale-110 filter brightness-110"
                            )}
                            priority
                        />
                    ) : (
                        <div className={clsx(
                            "flex items-center justify-center w-full h-full",
                            isDark ? "bg-gray-800" : "bg-gray-200"
                        )}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                            </svg>
                        </div>
                    )}

                    {/* Enhanced dual gradient overlay */}
                    <div className={clsx(
                        "absolute inset-0 bg-gradient-to-t transition-opacity duration-300",
                        "from-black/80 via-black/40 to-transparent",
                        isHovered ? "opacity-90" : "opacity-60"
                    )} />

                    {/* Side gradient for more dramatic effect */}
                    <div className={clsx(
                        "absolute inset-0 bg-gradient-to-r transition-opacity duration-300",
                        "from-black/40 to-transparent",
                        isHovered ? "opacity-70" : "opacity-0"
                    )} />

                    {/* Language badge with animation */}
                    <div className="absolute top-3 left-3">
                        <motion.div
                            className={clsx(
                                "py-1 px-3 rounded-full text-xs font-medium",
                                "bg-emerald-500/90 text-white backdrop-blur-md"
                            )}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0, transition: { delay: animationDelay + 0.2 } }}
                            whileHover={{ scale: 1.05 }}
                        >
                            {primaryLanguage}
                            {additionalLanguages > 0 && (
                                <span className="ml-1">+{additionalLanguages}</span>
                            )}
                        </motion.div>
                    </div>

                    {/* Play button overlay with enhanced animation */}
                    <motion.div
                        className={clsx(
                            "absolute inset-0 flex items-center justify-center transition-all duration-500",
                            isHovered ? "opacity-100" : "opacity-0"
                        )}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                    >
                        <motion.div
                            className="bg-emerald-500 rounded-full p-4 backdrop-blur-sm shadow-lg shadow-emerald-500/20"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: isHovered ? 1 : 0.8,
                                opacity: isHovered ? 1 : 0,
                                transition: { type: "spring", stiffness: 400, damping: 10 }
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </motion.div>
                    </motion.div>

                    {/* Enhanced title and description overlay with better positioning and animations */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        <motion.h3
                            className="font-bold text-xl text-white mb-1 drop-shadow-md"
                            initial={{ y: 10, opacity: 0.8 }}
                            animate={{
                                y: isHovered ? 0 : 10,
                                opacity: 1,
                                transition: { duration: 0.3 }
                            }}
                        >
                            {name}
                        </motion.h3>

                        <motion.div
                            className="flex items-center"
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: isHovered ? 1 : 0.7,
                                transition: { duration: 0.3, delay: 0.1 }
                            }}
                        >
                            {additionalLanguages > 0 && (
                                <div className="flex items-center space-x-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                    <p className="text-sm text-gray-200 drop-shadow-md">
                                        {`${languageArray.length} idiomas disponíveis`}
                                    </p>
                                </div>
                            )}
                        </motion.div>

                        {/* Action button that appears on hover */}
                        <motion.div
                            className="mt-3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                                opacity: isHovered ? 1 : 0,
                                y: isHovered ? 0 : 10,
                                transition: { duration: 0.3 }
                            }}
                        >
                            <div className="inline-flex items-center space-x-1 text-xs font-medium text-emerald-400">
                                <span>Ver detalhes</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Success rate indicator (for premium look) */}
                {index < 3 && (
                    <div className="absolute top-0 right-0">
                        <div className={clsx(
                            "py-1 px-2 rounded-bl-lg rounded-tr-lg text-xs font-bold",
                            index === 0 ? "bg-amber-400 text-amber-900" :
                                index === 1 ? "bg-gray-300 text-gray-700" :
                                    "bg-amber-700 text-amber-100"
                        )}>
                            #{index + 1}
                        </div>
                    </div>
                )}
            </motion.div>
        </Link>
    );
};

export default CardMovieBig;
