"use client";

import { getLanguage } from '@backend/domain/actions/Languages/getLanguage.action';
import BackButton from '@common/BackButton';
import { StoreLanguage } from '@common/StoreLanguage';
import { GAMES } from '@constants/GAMES';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Inter, Poppins } from 'next/font/google';
import { useEffect, useState } from 'react';
import GameCard from './_components/GameCard';

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

export default function GamesPage({
    language,
    languageCode = undefined,
    mediaId = undefined,
}: {
    language?: Awaited<ReturnType<typeof getLanguage>>;
    languageCode?: string;
    mediaId?: string;
}) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // After mounting, we have access to the theme
    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted ? theme === 'dark' : false;

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const allowedGames = ['Translate', 'Memory', 'Flashcards'];
    const filteredGames = GAMES
    // .filter(({ title }) => allowedGames.includes(title));

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-white via-zinc-50 to-sky-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 py-8">
            {/* Store language data */}
            {(!!language || !!languageCode) && (
                <StoreLanguage
                    words={[]}
                    language={language?.language?.code || languageCode}
                    mediaId={mediaId}
                />
            )}

            {/* Decorative background elements */}
            <div className="fixed top-20 right-20 w-64 h-64 bg-emerald-400/10 dark:bg-emerald-900/10 rounded-full blur-3xl -z-10" />
            <div className="fixed bottom-20 left-20 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-900/10 rounded-full blur-3xl -z-10" />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <BackButton title="Games" />
                </div>

                {/* Description */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <p className={`${inter.className} text-lg text-gray-700 dark:text-gray-300 max-w-2xl`}>
                        Learn new words and phrases through interactive games and challenges.
                        Choose one of our learning methods to enhance your language skills.
                    </p>
                </motion.div>

                {/* Games Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {filteredGames.map((game, index) => (
                        <GameCard
                            key={`game-${index}`}
                            game={game}
                            index={index}
                            mediaId={mediaId}
                            languageCode={language?.language?.code || languageCode}
                        />
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
