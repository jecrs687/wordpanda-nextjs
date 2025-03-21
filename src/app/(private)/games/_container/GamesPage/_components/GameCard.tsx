"use client";

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Inter, Poppins } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Font definitions
const poppins = Poppins({
    weight: ['500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
});

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
});

// Define gradient patterns for different game types
const gradientPatterns = [
    'bg-gradient-to-br from-emerald-400 to-cyan-400 dark:from-emerald-500 dark:to-cyan-500',
    'bg-gradient-to-br from-indigo-400 to-purple-400 dark:from-indigo-500 dark:to-purple-500',
    'bg-gradient-to-br from-rose-400 to-amber-400 dark:from-rose-500 dark:to-amber-500',
    'bg-gradient-to-br from-blue-400 to-indigo-400 dark:from-blue-500 dark:to-indigo-500',
    'bg-gradient-to-br from-amber-400 to-orange-400 dark:from-amber-500 dark:to-orange-500',
    'bg-gradient-to-br from-cyan-400 to-blue-400 dark:from-cyan-500 dark:to-blue-500',
];

// Icons as SVG components (simplified representations)
const Icons = {
    Translate: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 8l6 6M4 14h6m4-6h6m-3-3l3 3-3 3" />
        </svg>
    ),
    Memory: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <path d="M10 10h4v4h-4z" />
        </svg>
    ),
    Flashcards: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    ),
    Default: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    ),
};

// Pattern elements for decoration
const PatternElement = ({ index }: { index: number }) => {
    // Different pattern based on index
    const patterns = [
        <div key="pattern1" className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/20 blur-sm"></div>,
        <div key="pattern2" className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-white/10"></div>,
        <div key="pattern3" className="absolute top-10 left-4 w-5 h-5 rounded-md bg-white/15 rotate-45"></div>,
        <div key="pattern4" className="absolute bottom-2 left-2 w-8 h-8 rounded-full bg-white/10 blur-sm"></div>,
        <div key="pattern5" className="absolute top-4 left-10 w-6 h-6 rounded-md bg-white/15 rotate-12"></div>,
        <div key="pattern6" className="absolute bottom-8 right-4 w-6 h-6 rounded-full bg-white/15 blur-sm"></div>,
    ];

    return patterns[index % patterns.length] || patterns[0];
};

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
    const router = useRouter();
    const Icon = Icons[game.title as keyof typeof Icons] || Icons.Default;

    const handleOpenGame = () => {
        if (!game.url) return;

        router.push(game.url);
    };

    return (
        <motion.div
            className="h-full"
            whileTap={{ scale: 0.98 }}
        >
            <div
                onClick={handleOpenGame}
                className={`relative h-full rounded-2xl overflow-hidden backdrop-blur-md shadow-lg dark:shadow-gray-950/20 cursor-pointer border dark:border-gray-800/50 border-gray-100 group`}
            >
                {/* Colorful Gradient Background */}
                <div className={`absolute inset-0 ${gradientPatterns[index % gradientPatterns.length]} opacity-80`}></div>

                {/* Glass overlay for a premium feel */}
                <div className="absolute inset-0 bg-white/20 dark:bg-gray-900/30 backdrop-blur-[2px]"></div>

                {/* Decorative pattern elements */}
                <PatternElement index={index} />

                {/* Card Content */}
                <div className="relative z-10 h-full flex flex-col p-6">
                    {/* Icon with glow effect */}
                    <div className="mb-4 text-white">
                        <div className="p-3 rounded-full bg-white/20 inline-block backdrop-blur-sm">
                            <Icon />
                        </div>
                    </div>

                    {/* Game Title and Description */}
                    <h3 className={`${poppins.className} text-2xl font-bold text-white mb-2`}>
                        {game.title}
                    </h3>

                    <p className={`${inter.className} text-white/90 text-sm mb-4 grow`}>
                        {game.description}
                    </p>

                    {/* Call to Action Button */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-auto"
                    >
                        <div className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-md text-white text-center font-medium group-hover:bg-white/30 transition-all">
                            Start Game
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
