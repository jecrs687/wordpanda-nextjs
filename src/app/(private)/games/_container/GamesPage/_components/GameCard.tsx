"use client";

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Inter, Poppins } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

// Font definitions
const poppins = Poppins({
    weight: ['600'],
    subsets: ['latin'],
    display: 'swap',
});

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
});

interface GameCardProps {
    game: {
        title: string;
        description: string;
        image: string;
        url: string;
        Icon?: any;
    };
    index: number;
    mediaId?: string | number;
    languageCode?: string;
}

export default function GameCard({ game, index, mediaId, languageCode }: GameCardProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [isHovered, setIsHovered] = useState(false);

    // Construct URL with mediaId and languageCode if they exist
    const url = mediaId && languageCode
        ? `${game.url}?mediaId=${mediaId}&language=${languageCode}`
        : game.url;

    // Get a different color for each card based on the index
    const getAccentColor = (idx: number) => {
        const colors = [
            'from-emerald-500 to-cyan-500', // emerald to cyan
            'from-indigo-500 to-violet-500', // indigo to violet
            'from-cyan-500 to-blue-500', // cyan to blue
            'from-purple-500 to-pink-500', // purple to pink
        ];
        return colors[idx % colors.length];
    };

    const color = getAccentColor(index);

    // Animation variants
    const item = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                delay: index * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 24
            }
        }
    };

    return (
        <motion.div
            variants={item}
            className={`
        relative overflow-hidden rounded-2xl 
        ${isDark
                    ? 'bg-gray-800/60 border border-gray-700/50 shadow-xl shadow-black/20'
                    : 'bg-white/80 border border-gray-200/50 shadow-lg shadow-gray-200/30'
                }
        backdrop-blur-md
        group
        transition-all duration-500 ease-out
      `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Accent color bar at the top */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color} opacity-70 group-hover:opacity-100 transition-opacity duration-300`} />

            <Link href={url} className="block h-full">
                <div className="p-6">
                    {/* Game header with icon and title */}
                    <div className="flex items-center mb-5">
                        <div className={`rounded-xl p-3 bg-gradient-to-br ${color} shadow-lg`}>
                            {game.Icon ? (
                                <game.Icon className="h-6 w-6 text-white" />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            )}
                        </div>

                        <div className="ml-4">
                            <h3 className={`${poppins.className} text-xl font-bold text-gray-900 dark:text-white`}>{game.title}</h3>
                        </div>
                    </div>

                    {/* Game description */}
                    <div className="mb-6">
                        <p className={`${inter.className} text-sm text-gray-600 dark:text-gray-300`}>
                            {game.description}
                        </p>
                    </div>

                    {/* Game image */}
                    <div className="relative h-44 rounded-xl overflow-hidden mt-auto">
                        <Image
                            src={game.image}
                            alt={game.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Play button overlay */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center bg-black/20 dark:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                    >
                        <motion.div
                            className={`
                px-6 py-3 rounded-full bg-gradient-to-r ${color} 
                text-white font-medium flex items-center shadow-lg
              `}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: isHovered ? 1 : 0.8,
                                opacity: isHovered ? 1 : 0
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 25
                            }}
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 3v18l14-9L5 3z" fill="currentColor" />
                            </svg>
                            Play Now
                        </motion.div>
                    </motion.div>
                </div>
            </Link>

            {/* Decorative background elements */}
            <div className={`
        absolute -bottom-10 -right-10 w-40 h-40 rounded-full 
        bg-gradient-to-tl ${color} opacity-10 blur-3xl
        group-hover:opacity-20 transition-opacity duration-500 ease-out
      `} />
            <div className={`
        absolute -top-5 -left-5 w-24 h-24 rounded-full 
        bg-gradient-to-br ${color} opacity-5 blur-xl
        group-hover:opacity-10 transition-opacity duration-500 ease-out
      `} />
        </motion.div>
    );
}
