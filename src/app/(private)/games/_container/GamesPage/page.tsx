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

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    const allowedGames = ['Translate', 'Memory', 'Flashcards'];
    const filteredGames = GAMES;
    // .filter(({ title }) => allowedGames.includes(title));

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-white via-zinc-50 to-sky-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-emerald-950/10 px-4 py-8 relative overflow-hidden">
            {/* Store language data */}
            {(!!language || !!languageCode) && (
                <StoreLanguage
                    words={[]}
                    language={language?.language?.code || languageCode}
                    mediaId={mediaId}
                />
            )}

            {/* Decorative background elements */}
            <div className="fixed top-10 right-[10%] w-72 h-72 bg-emerald-400/15 dark:bg-emerald-500/10 rounded-full blur-3xl -z-10" />
            <div className="fixed bottom-10 left-[5%] w-96 h-96 bg-indigo-400/10 dark:bg-indigo-500/10 rounded-full blur-3xl -z-10" />
            <div className="fixed top-[40%] left-[15%] w-64 h-64 bg-cyan-400/10 dark:bg-cyan-500/10 rounded-full blur-3xl -z-10" />
            <div className="fixed top-[20%] right-[30%] w-40 h-40 bg-rose-400/10 dark:bg-rose-500/10 rounded-full blur-3xl -z-10" />

            {/* Subtle grid pattern overlay */}
            <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaC00djFoNHYtMXptNiAwaC00djFoNHYtMXptLTYtMmgtNHYxaDR2LTF6bTYgMGgtNHYxaDR2LTF6bS02LTJoLTR2MWg0di0xem0yIDBINDB2MWg0di0xem02IDBhoLTR2MWg0di0xem0yIDBINTB2MWg0di0xem0tNCA0aC00djFoNHYtMXptNiAwaC00djFoNHYtMXptMiAwaC00djFoNHYtMXptLTgtMmgtNHYxaDR2LTF6bTggMGgtNHYxaDR2LTF6bS04LTRoLTZ2MWg2di0xem0tNi00aC02djFoNnYtMXptMTQgNG0tNCAwaDR2MWgtNHYtMXptMCAxNGg0djFoLTR2LTF6bS0xNCAwaDR2MWgtNHYtMXptMTQtNGg0djFoLTR2LTF6bS0xNCAwaDR2MWgtNHYtMXoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50 dark:opacity-20 mix-blend-soft-light pointer-events-none -z-20" />

            <div className="max-w-7xl mx-auto">
                {/* Header with animated reveal */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mb-8 flex items-center"
                >
                    <BackButton title="Games" />
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="ml-4 h-0.5 bg-gradient-to-r from-emerald-400 to-transparent dark:from-emerald-500 flex-grow origin-left"
                    />
                </motion.div>

                {/* Description with enhanced typography */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-12"
                >
                    <h1 className={`${poppins.className} text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight`}>
                        Enhance Your Language Skills
                    </h1>
                    <p className={`${inter.className} text-lg text-gray-700 dark:text-zinc-300 max-w-2xl leading-relaxed`}>
                        Master new words and phrases through our interactive games and challenges.
                        Each activity is designed to make learning engaging, effective, and fun.
                    </p>
                </motion.div>

                {/* Games Grid with improved spacing and animations */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {filteredGames.map((game, index) => (
                        <motion.div
                            key={`game-${index}`}
                            variants={itemVariants}
                            whileHover={{
                                y: -8,
                                transition: { type: "spring", stiffness: 300, damping: 15 }
                            }}
                            className="h-full"
                        >
                            <GameCard
                                game={game}
                                index={index}
                                mediaId={mediaId}
                                languageCode={language?.language?.code || languageCode}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
