"use client";

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Inter, Poppins } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

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
}

export default function GameCard({ game, index }: GameCardProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Get a different color for each card based on the index
    const getAccentColor = (idx: number) => {
        const colors = [
            'from-emerald-500 to-cyan-500', // emerald to cyan
            'from-indigo-500 to-violet-500', // indigo to violet
            'from-cyan-500 to-blue-500', // cyan to blue
            'from-rose-500 to-purple-500', // rose to purple
            'from-amber-500 to-orange-500', // amber to orange
            'from-teal-500 to-emerald-500', // teal to emerald
            'from-violet-500 to-indigo-500', // violet to indigo
        ];
        return colors[idx % colors.length];
    };

    const color = getAccentColor(index);

    return (
        <motion.div
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            className={`
        relative overflow-hidden rounded-2xl 
        ${isDark
                    ? 'bg-gray-800/70 border border-gray-700/50 shadow-lg shadow-black/20'
                    : 'bg-white/90 border border-gray-100 shadow-xl shadow-gray-200/30'
                }
        backdrop-blur-md h-full
        group cursor-pointer
        transition-all duration-500 ease-out
      `}
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: 1,
                y: 0,
                transition: {
                    delay: index * 0.1,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 400,
                    damping: 28
                }
            }}
        >
            {/* Accent color bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color} opacity-80 group-hover:opacity-100 transition-opacity duration-300`} />

            <Link href={game.url} className="block h-full">
                <div className="p-6 flex flex-col h-full">
                    <div className="flex items-start mb-4">
                        <div className={`rounded-xl p-3 bg-gradient-to-br ${color} shadow-lg`}>
                            {game.Icon ? (
                                <game.Icon className="h-6 w-6 text-white" />
                            ) : (
                                <div className="relative h-6 w-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        <div className="ml-4 flex-1">
                            <h3 className={`${poppins.className} text-xl font-semibold text-gray-900 dark:text-white mb-1`}>
                                {game.title}
                            </h3>
                            <p className={`${inter.className} text-sm text-gray-600 dark:text-gray-300`}>
                                {game.description}
                            </p>
                        </div>
                    </div>

                    <div className="mt-auto pt-4">
                        <div className="relative w-full h-40 rounded-lg overflow-hidden">
                            <Image
                                src={game.image}
                                alt={game.title}
                                fill
                                className="object-cover transition-transform group-hover:scale-105 duration-700"
                            />

                            {/* Image overlay for better text readability on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            className="mt-4 text-right"
                        >
                            <span className={`
                inline-flex items-center text-sm font-medium
                ${isDark ? 'text-emerald-400' : 'text-emerald-600'}
              `}>
                                Começar agora
                                <svg className="ml-1 w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </motion.div>
                    </div>
                </div>
            </Link>

            {/* Decorative background elements */}
            <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-tl ${color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-500 ease-out`} />
            <div className={`absolute -top-5 -left-5 w-24 h-24 rounded-full bg-gradient-to-br ${color} opacity-5 blur-xl group-hover:opacity-10 transition-opacity duration-500 ease-out`} />
        </motion.div>
    );
}
