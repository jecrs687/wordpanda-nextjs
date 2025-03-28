'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { Activity, BarChart2, TrendingUp } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function TrendingWords() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = theme === 'dark';

    const trendingWords = [
        {
            word: "Vibe",
            translation: "Clima/sensação",
            language: "Inglês",
            usage: "+230%",
            example: "The vibe at the party was amazing.",
            category: "Redes Sociais",
            level: "Fácil",
            color: "cyan"
        },
        {
            word: "Cringe",
            translation: "Vergonha alheia",
            language: "Inglês",
            usage: "+186%",
            example: "That was such a cringe moment in the movie.",
            category: "Internet",
            level: "Médio",
            color: "purple"
        },
        {
            word: "Schadenfreude",
            translation: "Alegria com o infortúnio alheio",
            language: "Alemão",
            usage: "+120%",
            example: "He felt schadenfreude when his rival failed.",
            category: "Psicologia",
            level: "Difícil",
            color: "pink"
        },
        {
            word: "Hygge",
            translation: "Aconchego/conforto",
            language: "Dinamarquês",
            usage: "+95%",
            example: "Their home was full of hygge during winter.",
            category: "Lifestyle",
            level: "Médio",
            color: "amber"
        },
        {
            word: "Chido",
            translation: "Legal/bacana",
            language: "Espanhol (México)",
            usage: "+78%",
            example: "¡Que chido está tu nuevo coche!",
            category: "Gírias",
            level: "Fácil",
            color: "emerald"
        }
    ];

    const getColorClass = (color, isDark, type) => {
        const colorMap = {
            cyan: {
                bg: isDark ? "bg-cyan-500/10" : "bg-cyan-50",
                text: isDark ? "text-cyan-400" : "text-cyan-700",
                border: isDark ? "border-cyan-500/20" : "border-cyan-200"
            },
            purple: {
                bg: isDark ? "bg-purple-500/10" : "bg-purple-50",
                text: isDark ? "text-purple-400" : "text-purple-700",
                border: isDark ? "border-purple-500/20" : "border-purple-200"
            },
            pink: {
                bg: isDark ? "bg-pink-500/10" : "bg-pink-50",
                text: isDark ? "text-pink-400" : "text-pink-700",
                border: isDark ? "border-pink-500/20" : "border-pink-200"
            },
            amber: {
                bg: isDark ? "bg-amber-500/10" : "bg-amber-50",
                text: isDark ? "text-amber-400" : "text-amber-700",
                border: isDark ? "border-amber-500/20" : "border-amber-200"
            },
            emerald: {
                bg: isDark ? "bg-emerald-500/10" : "bg-emerald-50",
                text: isDark ? "text-emerald-400" : "text-emerald-700",
                border: isDark ? "border-emerald-500/20" : "border-emerald-200"
            }
        };

        return colorMap[color][type];
    };

    return (
        <section className="py-16 relative overflow-hidden" id="trending">
            <div className="absolute inset-0 pointer-events-none">
                <div className={cn(
                    "absolute top-0 right-0 w-1/2 h-1/2 rounded-full blur-3xl opacity-20 -z-10",
                    isDark ? "bg-pink-900" : "bg-pink-100"
                )} />
            </div>

            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className={cn(
                            "inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-sm font-medium mb-4",
                            isDark
                                ? "bg-pink-500/10 text-pink-400 border border-pink-500/20"
                                : "bg-pink-50 text-pink-700 border border-pink-100"
                        )}
                    >
                        <TrendingUp className="w-4 h-4" />
                        <span>Trending Words</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold mb-4"
                    >
                        Palavras que estão{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-500">
                            bombando
                        </span>{' '}
                        globalmente
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className={cn(
                            "max-w-2xl mx-auto text-lg mb-10",
                            isDark ? "text-zinc-300" : "text-zinc-700"
                        )}
                    >
                        Aprenda as palavras e expressões mais utilizadas nas redes sociais, filmes, séries e conversas ao redor do mundo
                    </motion.p>
                </div>

                {/* Trending header stats */}
                <div className="mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className={cn(
                            "p-4 rounded-xl border flex flex-wrap justify-between gap-4",
                            isDark
                                ? "bg-gray-900/50 border-gray-800"
                                : "bg-white border-gray-200 shadow-sm"
                        )}
                    >
                        {[
                            {
                                label: "Palavras monitoradas",
                                value: "12.854",
                                icon: <BarChart2 className="w-5 h-5" />,
                                change: "+143 hoje"
                            },
                            {
                                label: "Tendências analisadas",
                                value: "287",
                                icon: <TrendingUp className="w-5 h-5" />,
                                change: "+8 esta semana"
                            },
                            {
                                label: "Idiomas",
                                value: "24",
                                icon: <Activity className="w-5 h-5" />,
                                change: "Atualizado diariamente"
                            }
                        ].map((stat, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center",
                                    isDark ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-700"
                                )}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <div className="font-bold text-lg">{stat.value}</div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {stat.label}
                                        </div>
                                        <div className={cn(
                                            "text-xs",
                                            isDark ? "text-cyan-400" : "text-cyan-600"
                                        )}>
                                            {stat.change}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Trending words grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trendingWords.map((word, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className={cn(
                                "p-5 rounded-xl border backdrop-blur-sm",
                                isDark
                                    ? "bg-gray-900/50 border-gray-800 hover:bg-gray-900/70"
                                    : "bg-white/70 border-gray-200 hover:bg-white shadow-sm hover:shadow"
                            )}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className={cn(
                                        "text-xs font-medium mb-1 px-2 py-0.5 rounded inline-block",
                                        getColorClass(word.color, isDark, 'bg'),
                                        getColorClass(word.color, isDark, 'text')
                                    )}>
                                        {word.language}
                                    </div>
                                    <h3 className="text-xl font-bold">{word.word}</h3>
                                </div>
                                <div className={cn(
                                    "px-2 py-1 rounded text-xs font-bold",
                                    isDark ? "bg-pink-500/20 text-pink-400" : "bg-pink-100 text-pink-700"
                                )}>
                                    {word.usage}
                                </div>
                            </div>

                            <p className="text-sm text-gray-400 dark:text-gray-300 mb-3">
                                {word.translation}
                            </p>

                            <div className={cn(
                                "p-3 rounded-lg text-sm mb-4 border",
                                getColorClass(word.color, isDark, 'bg'),
                                getColorClass(word.color, isDark, 'border')
                            )}>
                                <p className={cn(
                                    "italic",
                                    getColorClass(word.color, isDark, 'text')
                                )}>
                                    "{word.example}"
                                </p>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="flex gap-2">
                                    <div className={cn(
                                        "text-xs px-2 py-0.5 rounded",
                                        isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
                                    )}>
                                        {word.category}
                                    </div>
                                    <div className={cn(
                                        "text-xs px-2 py-0.5 rounded",
                                        word.level === "Fácil" ? (isDark ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-100 text-emerald-700") :
                                            word.level === "Médio" ? (isDark ? "bg-amber-900/30 text-amber-400" : "bg-amber-100 text-amber-700") :
                                                (isDark ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-700")
                                    )}>
                                        {word.level}
                                    </div>
                                </div>

                                <button className={cn(
                                    "text-xs font-medium px-2 py-1 rounded",
                                    isDark ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                                )}>
                                    Adicionar
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="mt-8 text-center"
                >
                    <button className={cn(
                        "px-6 py-2 rounded-lg font-medium",
                        isDark
                            ? "bg-gray-800 hover:bg-gray-700 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    )}>
                        Ver todas as palavras em alta
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
