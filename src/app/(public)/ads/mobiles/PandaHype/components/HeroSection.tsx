'use client';

import { ROUTES } from '@/src/containers/constants/ROUTES';
import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

export default function HeroSection() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <section className="py-10 sm:py-16">
            <div className="flex flex-col items-center">
                {/* Logo and Panda */}
                <motion.div
                    className="relative w-32 h-32 mb-8"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-black to-gray-700 flex items-center justify-center">
                        <div className="bg-white dark:bg-gray-800 rounded-full h-[90%] w-[90%] flex items-center justify-center">
                            <div className="text-4xl font-bold">
                                <span className="text-emerald-500">Word</span>
                                <span className="text-black dark:text-white">Panda</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -top-4 -left-2 w-8 h-8 rounded-full bg-black"></div>
                    <div className="absolute -top-4 -right-2 w-8 h-8 rounded-full bg-black"></div>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    className="text-4xl sm:text-5xl font-extrabold text-center leading-tight mb-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
                        Transforme Filmes
                    </span><br />
                    <span>Em Aulas Divertidas!</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    className="text-lg sm:text-xl text-center text-zinc-600 dark:text-zinc-300 max-w-xl mb-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    Aprenda idiomas enquanto assiste seus filmes favoritos.
                    É simples, eficiente e incrivelmente divertido!
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-4 w-full max-w-sm mx-auto"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <Link
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 rounded-full font-medium",
                            "transition-all duration-300 shadow-lg",
                            "bg-gradient-to-r from-emerald-400 to-emerald-600 text-white",
                            "hover:shadow-emerald-500/25 hover:shadow-xl"
                        )}
                        href={ROUTES.REGISTER()}>
                        <motion.button
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full font-medium",
                                "transition-all duration-300 shadow-lg",
                                "bg-gradient-to-r from-emerald-400 to-emerald-600 text-white",
                                "hover:shadow-emerald-500/25 hover:shadow-xl"
                            )}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Começar Grátis <ArrowRight size={18} />
                        </motion.button>
                    </Link>
                    <motion.button
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full font-medium",
                            "transition-all duration-300 backdrop-blur-xl",
                            isDark
                                ? "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                                : "bg-black/5 text-gray-800 border border-black/10 hover:bg-black/10"
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Ver Demo <Play size={18} />
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}
