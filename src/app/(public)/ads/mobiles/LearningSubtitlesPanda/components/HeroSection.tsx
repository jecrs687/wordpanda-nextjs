'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HeroSection() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = theme === 'dark';

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
    };

    return (
        <section className="relative py-12 md:py-20 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className={cn(
                    "absolute top-1/4 -left-24 w-64 h-64 rounded-full blur-3xl opacity-20",
                    isDark ? "bg-emerald-900" : "bg-emerald-200"
                )} />
                <div className={cn(
                    "absolute bottom-1/4 -right-20 w-72 h-72 rounded-full blur-3xl opacity-20",
                    isDark ? "bg-indigo-900" : "bg-indigo-200"
                )} />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 max-w-screen-md mx-auto text-center px-4"
            >
                {/* App logo and name */}
                <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-center gap-2 mb-6"
                >
                    <div className="relative w-12 h-12 flex items-center justify-center">
                        <div className={cn(
                            "absolute inset-0 rounded-xl rotate-6",
                            isDark ? "bg-emerald-500/20" : "bg-emerald-500/10"
                        )} />
                        <div className={cn(
                            "absolute inset-0 rounded-xl -rotate-6",
                            isDark ? "bg-indigo-500/20" : "bg-indigo-500/10"
                        )} />
                        <div className={cn(
                            "relative flex items-center justify-center w-10 h-10 rounded-xl",
                            isDark ? "bg-zinc-900" : "bg-white"
                        )}>
                            <span className="text-2xl">🐼</span>

                            {/* Ears */}
                            <span className={cn(
                                "absolute -top-1 -left-1 w-3 h-3 rounded-full",
                                isDark ? "bg-black" : "bg-zinc-800"
                            )} />
                            <span className={cn(
                                "absolute -top-1 -right-1 w-3 h-3 rounded-full",
                                isDark ? "bg-black" : "bg-zinc-800"
                            )} />
                        </div>
                    </div>
                    <span className="text-xl font-bold">
                        <span className={isDark ? "text-emerald-400" : "text-emerald-500"}>Word</span>
                        <span>Panda</span>
                    </span>
                </motion.div>

                {/* Main headline */}
                <motion.h1
                    variants={itemVariants}
                    className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
                >
                    Aprenda idiomas com
                    <span className={cn(
                        "ml-2 bg-clip-text text-transparent bg-gradient-to-r",
                        isDark ? "from-emerald-400 to-cyan-400" : "from-emerald-500 to-cyan-600"
                    )}>
                        legendas
                    </span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    variants={itemVariants}
                    className={cn(
                        "text-lg md:text-xl mb-8",
                        isDark ? "text-zinc-300" : "text-zinc-700"
                    )}
                >
                    Transforme seus filmes e séries favoritos em oportunidades reais de aprendizado
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link href="/register">
                        <motion.button
                            whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                            whileTap={{ scale: 0.97 }}
                            className={cn(
                                "px-8 py-3 rounded-xl font-medium text-white shadow-lg w-full sm:w-auto",
                                "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600",
                                "transition-all duration-300 flex items-center justify-center gap-2"
                            )}
                        >
                            Começar agora
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                                <path d="M5 12h14"></path>
                                <path d="m12 5 7 7-7 7"></path>
                            </svg>
                        </motion.button>
                    </Link>

                    <Link href="#demo">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className={cn(
                                "px-8 py-3 rounded-xl font-medium w-full sm:w-auto",
                                "border transition-all duration-300 flex items-center justify-center gap-2",
                                isDark
                                    ? "bg-gray-900/60 border-gray-700 hover:bg-gray-800/60 text-white"
                                    : "bg-white/80 border-gray-200 hover:bg-gray-50/80 text-gray-900"
                            )}
                        >
                            Ver demonstração
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polygon points="10 8 16 12 10 16 10 8" />
                            </svg>
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Mobile screenshot with animation */}
                <motion.div
                    variants={itemVariants}
                    className="relative mt-12 max-w-xs mx-auto"
                >
                    <div className={cn(
                        "absolute -inset-1 rounded-3xl blur-sm",
                        isDark ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20" : "bg-gradient-to-r from-emerald-500/10 to-cyan-500/10"
                    )} />

                    <div className={cn(
                        "relative rounded-2xl overflow-hidden border",
                        isDark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"
                    )}>
                        <div className={cn(
                            "h-8 flex items-center justify-center border-b",
                            isDark ? "border-gray-800" : "border-gray-200"
                        )}>
                            <div className="w-24 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
                        </div>

                        <div className="p-4">
                            <div className={cn(
                                "rounded-xl overflow-hidden shadow-md",
                                isDark ? "bg-gray-800" : "bg-gray-50"
                            )}>
                                <div className={cn(
                                    "flex items-center gap-2 p-3 border-b",
                                    isDark ? "border-gray-700" : "border-gray-200"
                                )}>
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                        🎬
                                    </div>
                                    <div className="flex-1">
                                        <div className="h-2.5 rounded-full w-24 bg-gray-300 dark:bg-gray-700 mb-1.5" />
                                        <div className="h-2 rounded-full w-16 bg-gray-200 dark:bg-gray-800" />
                                    </div>
                                </div>

                                <div className="p-3">
                                    <div className="h-2.5 rounded-full bg-gray-300 dark:bg-gray-700 mb-2.5 w-full" />
                                    <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800 mb-2.5 w-full" />
                                    <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800 w-4/5" />

                                    <div className={cn(
                                        "mt-4 p-2 rounded-lg border",
                                        isDark ? "border-emerald-800 bg-emerald-900/30" : "border-emerald-200 bg-emerald-50"
                                    )}>
                                        <div className="flex gap-2 items-center">
                                            <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs">
                                                📚
                                            </div>
                                            <div className="h-2.5 rounded-full w-20 bg-emerald-200 dark:bg-emerald-700" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                                className="mt-3 flex justify-end"
                            >
                                <div className={cn(
                                    "px-3 py-1.5 rounded-full text-sm",
                                    isDark ? "bg-indigo-500/20 text-indigo-300" : "bg-indigo-50 text-indigo-600"
                                )}>
                                    Nova palavra aprendida!
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
