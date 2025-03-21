"use client";

import { GAMES } from '@constants/GAMES';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Inter, Poppins } from 'next/font/google';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import GameCard from './_components/GameCard';

const poppins = Poppins({
    weight: ['400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
});

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
});

export default function GamesPage() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // After mounting, we have access to the theme
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = theme === 'dark';

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
                stiffness: 400,
                damping: 28
            }
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-white via-zinc-50 to-sky-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 py-8 md:py-12 lg:py-16">
            {/* Decorative background elements */}
            <div className="fixed top-20 right-20 w-64 h-64 bg-emerald-400/10 dark:bg-emerald-900/10 rounded-full blur-3xl -z-10" />
            <div className="fixed bottom-20 left-20 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-900/10 rounded-full blur-3xl -z-10" />

            <div className="max-w-7xl mx-auto">
                {/* Page header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <div className="flex items-center mb-4">
                        <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-0.5 rounded-xl mr-3">
                            <div className={`bg-white dark:bg-gray-900 p-2 rounded-lg`}>
                                <Image
                                    src="/assets/logo.png"
                                    alt="WordPanda"
                                    width={32}
                                    height={32}
                                />
                            </div>
                        </div>

                        <h1 className={`${poppins.className} text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-indigo-400`}>
                            Jogos de Aprendizado
                        </h1>
                    </div>

                    <p className={`${inter.className} text-gray-700 dark:text-gray-300 max-w-2xl`}>
                        Escolha entre nossa variedade de jogos interativos para praticar e aprimorar suas habilidades linguísticas de maneira divertida e eficaz.
                    </p>
                </motion.div >

                {/* Games grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {
                        GAMES.map((game, index) => (
                            <GameCard
                                key={game.title}
                                game={game}
                                index={index}
                            />
                        ))
                    }
                </motion.div>
            </div >
        </div>
    );
}

interface GameProps {
    game: {
        title: string;
        description: string;
        image: string;
        url: string;
        Icon?: any;
    };
    index: number;
}