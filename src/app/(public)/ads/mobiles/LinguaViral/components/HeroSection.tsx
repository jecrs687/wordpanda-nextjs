'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, Zap } from 'lucide-react';
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

    const viralWords = ['Fluente', 'Natural', 'Rápido', 'Divertido', 'Eficiente'];

    return (
        <section className="relative py-12 md:py-16 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className={cn(
                    "absolute -top-10 -right-20 w-72 h-72 rounded-full blur-3xl opacity-20",
                    isDark ? "bg-purple-900" : "bg-purple-200"
                )} />
                <div className={cn(
                    "absolute -bottom-20 -left-20 w-72 h-72 rounded-full blur-3xl opacity-20",
                    isDark ? "bg-cyan-900" : "bg-cyan-200"
                )} />

                {/* Animated particles */}
                {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className={cn(
                            "absolute w-1 h-1 rounded-full",
                            isDark ? "bg-cyan-400" : "bg-cyan-500"
                        )}
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            opacity: Math.random() * 0.5 + 0.3,
                            scale: Math.random() * 1 + 0.5,
                        }}
                        animate={{
                            y: [null, Math.random() * -100 - 50],
                            opacity: [null, 0],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                        }}
                    />
                ))}
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 max-w-screen-md mx-auto text-center px-4"
            >
                {/* App logo and name with viral theme */}
                <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-center gap-2 mb-6"
                >
                    <div className="relative w-12 h-12 flex items-center justify-center">
                        <div className={cn(
                            "absolute inset-0 rounded-xl rotate-6",
                            isDark ? "bg-cyan-500/20" : "bg-cyan-500/10"
                        )} />
                        <div className={cn(
                            "absolute inset-0 rounded-xl -rotate-6",
                            isDark ? "bg-purple-500/20" : "bg-purple-500/10"
                        )} />
                        <div className={cn(
                            "relative flex items-center justify-center w-10 h-10 rounded-xl",
                            isDark ? "bg-zinc-900" : "bg-white"
                        )}>
                            <span className="text-2xl">🐼</span>

                            {/* Viral indicators */}
                            <motion.span
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className={cn(
                                    "absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full",
                                    isDark ? "bg-cyan-500 text-black" : "bg-cyan-500 text-white"
                                )}
                            >
                                <Zap className="w-3 h-3" />
                            </motion.span>
                        </div>
                    </div>
                    <span className="text-xl font-bold">
                        <span className={isDark ? "text-cyan-400" : "text-cyan-500"}>Word</span>
                        <span>Panda</span>
                    </span>
                </motion.div>

                {/* Trending tag */}
                <motion.div
                    variants={itemVariants}
                    className={cn(
                        "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium mb-6",
                        isDark
                            ? "bg-purple-500/20 border border-purple-500/30 text-purple-300"
                            : "bg-purple-100 border border-purple-200 text-purple-700"
                    )}
                >
                    <TrendingUp className="w-3 h-3" />
                    <span>Tendência em 2023</span>
                </motion.div>

                {/* Main headline */}
                <motion.h1
                    variants={itemVariants}
                    className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
                >
                    O jeito <span className="relative inline-block">
                        <span className={cn(
                            "bg-clip-text text-transparent bg-gradient-to-r",
                            isDark ? "from-cyan-400 to-purple-400" : "from-cyan-500 to-purple-600"
                        )}>
                            viral
                        </span>
                        <motion.span
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={cn(
                                "absolute -top-5 -right-2 text-2xl",
                                isDark ? "text-cyan-400" : "text-cyan-500"
                            )}
                        >
                            ✨
                        </motion.span>
                    </span> de aprender idiomas
                </motion.h1>

                {/* Rotating words */}
                <motion.div
                    variants={itemVariants}
                    className="h-8 mb-6 overflow-hidden"
                >
                    <motion.div
                        animate={{ y: [0, -160, 0] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    >
                        {viralWords.map((word, index) => (
                            <div key={index} className="h-8 flex items-center justify-center">
                                <span className={cn(
                                    "text-xl font-semibold",
                                    isDark ? "text-cyan-400" : "text-cyan-600"
                                )}>{word}</span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Subheadline */}
                <motion.p
                    variants={itemVariants}
                    className={cn(
                        "text-lg md:text-xl mb-8",
                        isDark ? "text-zinc-300" : "text-zinc-700"
                    )}
                >
                    Junte-se a mais de 100 mil brasileiros aprendendo com desafios diários e competições divertidas
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
                                "bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600",
                                "transition-all duration-300 flex items-center justify-center gap-2"
                            )}
                        >
                            Comece a Viralizar
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </Link>

                    <Link href="#trending">
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
                            Ver Tendências
                            <Sparkles className="w-5 h-5" />
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Mobile app preview */}
                <motion.div
                    variants={itemVariants}
                    className="mt-12 relative"
                >
                    <div className={cn(
                        "absolute -inset-4 rounded-3xl blur-lg opacity-30",
                        isDark ? "bg-gradient-to-r from-cyan-500/30 to-purple-500/30" : "bg-gradient-to-r from-cyan-500/20 to-purple-500/20"
                    )} />

                    <div className="relative z-10 flex justify-center">
                        <div className={cn(
                            "w-64 h-[500px] rounded-[2.5rem] border-8 overflow-hidden",
                            isDark ? "border-gray-800" : "border-gray-200"
                        )}>
                            <div className={cn(
                                "absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20",
                                isDark ? "bg-black" : "bg-gray-900"
                            )} />

                            <div className={cn(
                                "w-full h-full",
                                isDark ? "bg-gray-900" : "bg-white"
                            )}>
                                {/* App UI Preview - Viral Leaderboard */}
                                <div className="p-4">
                                    <div className={cn(
                                        "text-center p-3 mb-4 rounded-xl",
                                        isDark ? "bg-gray-800" : "bg-gray-100"
                                    )}>
                                        <div className="text-lg font-bold mb-1">Desafio do Dia</div>
                                        <div className={cn(
                                            "text-sm font-medium",
                                            isDark ? "text-cyan-400" : "text-cyan-600"
                                        )}>
                                            +52 palavras · 24 horas restantes
                                        </div>
                                    </div>

                                    <div className={cn(
                                        "rounded-xl mb-4 overflow-hidden",
                                        isDark ? "bg-gray-800" : "bg-gray-100"
                                    )}>
                                        <div className={cn(
                                            "p-3 text-center",
                                            isDark ? "bg-gray-700" : "bg-gray-200"
                                        )}>
                                            <span className="font-bold">Líderes da Semana</span>
                                        </div>

                                        {/* Top users */}
                                        {[
                                            { name: "MarianaR", points: "1,240", medal: "🥇" },
                                            { name: "PedroViajante", points: "980", medal: "🥈" },
                                            { name: "JuliaFalante", points: "875", medal: "🥉" },
                                        ].map((user, idx) => (
                                            <div key={idx} className={cn(
                                                "flex items-center p-3",
                                                isDark ?
                                                    (idx === 0 ? "bg-gray-800/80 border-l-4 border-yellow-500" : "bg-gray-800") :
                                                    (idx === 0 ? "bg-white border-l-4 border-yellow-500" : "bg-white")
                                            )}>
                                                <div className="w-8 text-xl">{user.medal}</div>
                                                <div className="flex-1 font-medium">{user.name}</div>
                                                <div className={cn(
                                                    "font-bold",
                                                    isDark ? "text-cyan-400" : "text-cyan-600"
                                                )}>{user.points}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className={cn(
                                        "p-4 rounded-xl text-center",
                                        isDark ?
                                            "bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border border-cyan-800/30" :
                                            "bg-gradient-to-r from-cyan-50 to-purple-50 border border-cyan-100"
                                    )}>
                                        <div className="text-sm font-bold mb-2">Sua posição atual</div>
                                        <div className="text-3xl font-bold mb-1">
                                            <span className={cn(
                                                isDark ? "text-white" : "text-gray-900"
                                            )}>42</span>
                                            <span className={cn(
                                                "text-xl",
                                                isDark ? "text-gray-400" : "text-gray-500"
                                            )}>/1204</span>
                                        </div>
                                        <div className={cn(
                                            "text-sm",
                                            isDark ? "text-gray-400" : "text-gray-500"
                                        )}>
                                            Faltam 85 pontos para você subir de nível
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Animated viral elements */}
                        <motion.div
                            initial={{ opacity: 0, y: 0, x: 0 }}
                            animate={{ opacity: 1, y: -10, x: 20 }}
                            transition={{
                                y: { duration: 2, repeat: Infinity, repeatType: 'reverse' },
                                opacity: { duration: 0.5 }
                            }}
                            className="absolute -top-4 -right-2 z-10"
                        >
                            <div className={cn(
                                "px-3 py-1.5 rounded-full text-sm font-medium",
                                isDark ?
                                    "bg-purple-500/30 border border-purple-500/30 text-purple-300" :
                                    "bg-purple-100 border border-purple-200 text-purple-700"
                            )}>
                                🔥 Em alta!
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 0, x: 0 }}
                            animate={{ opacity: 1, y: 10, x: -30 }}
                            transition={{
                                y: { duration: 3, repeat: Infinity, repeatType: 'reverse', delay: 1 },
                                opacity: { duration: 0.5, delay: 0.2 }
                            }}
                            className="absolute top-1/3 -left-10 z-10"
                        >
                            <div className={cn(
                                "px-3 py-1.5 rounded-full text-sm font-medium",
                                isDark ?
                                    "bg-cyan-500/30 border border-cyan-500/30 text-cyan-300" :
                                    "bg-cyan-100 border border-cyan-200 text-cyan-700"
                            )}>
                                +28 amigos
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
