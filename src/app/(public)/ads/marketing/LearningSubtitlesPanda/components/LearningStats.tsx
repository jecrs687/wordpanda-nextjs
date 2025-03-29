'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

// Component to animate number counting up
const CounterAnimation = ({ end, duration = 2, className }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime;
        let animationFrame;

        const updateCount = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
            setCount(Math.floor(progress * end));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(updateCount);
            }
        };

        animationFrame = requestAnimationFrame(updateCount);

        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return <span className={className}>{count.toLocaleString()}</span>;
};

export default function LearningStats() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = theme === 'dark';

    const stats = [
        { value: 12000, label: "Usuários ativos", icon: "👥", color: "emerald" },
        { value: 987000, label: "Palavras aprendidas", icon: "📚", color: "indigo" },
        { value: 24, label: "Idiomas disponíveis", icon: "🌎", color: "amber" },
        { value: 2800, label: "Filmes e séries", icon: "🎬", color: "cyan" }
    ];

    const getStatColors = (color, isDark) => {
        const colorMap = {
            emerald: isDark
                ? "bg-emerald-900/20 text-emerald-400 border-emerald-900/30"
                : "bg-emerald-50 text-emerald-700 border-emerald-100",
            indigo: isDark
                ? "bg-indigo-900/20 text-indigo-400 border-indigo-900/30"
                : "bg-indigo-50 text-indigo-700 border-indigo-100",
            amber: isDark
                ? "bg-amber-900/20 text-amber-400 border-amber-900/30"
                : "bg-amber-50 text-amber-700 border-amber-100",
            cyan: isDark
                ? "bg-cyan-900/20 text-cyan-400 border-cyan-900/30"
                : "bg-cyan-50 text-cyan-700 border-cyan-100"
        };

        return colorMap[color];
    };

    return (
        <section className="py-16 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className={cn(
                    "absolute bottom-0 left-0 w-1/2 h-1/2 rounded-full blur-3xl opacity-20 -z-10",
                    isDark ? "bg-emerald-900" : "bg-emerald-100"
                )} />
            </div>

            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className={cn(
                            "inline-block px-4 py-1 rounded-full text-sm font-medium mb-4",
                            isDark
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        )}
                    >
                        Números que Impressionam
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold mb-4"
                    >
                        A comunidade{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-emerald-500">
                            WordPanda
                        </span>{' '}
                        em números
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className={cn(
                            "max-w-2xl mx-auto text-lg mb-12",
                            isDark ? "text-zinc-300" : "text-zinc-700"
                        )}
                    >
                        Junte-se a milhares de pessoas que já estão transformando a maneira de aprender idiomas
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className={cn(
                                "relative p-6 rounded-2xl border backdrop-blur-sm text-center",
                                isDark
                                    ? "bg-gray-900/50 border-gray-800 hover:bg-gray-900/70"
                                    : "bg-white/70 border-gray-200 hover:bg-white shadow-sm hover:shadow"
                            )}
                        >
                            <div className="flex justify-center mb-4">
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                                    viewport={{ once: true }}
                                    className={cn(
                                        "w-16 h-16 rounded-2xl flex items-center justify-center text-2xl border",
                                        getStatColors(stat.color, isDark)
                                    )}
                                >
                                    {stat.icon}
                                </motion.div>
                            </div>

                            <h3 className="text-3xl font-bold mb-1 flex justify-center">
                                {stat.value > 1000 ? (
                                    <>
                                        <CounterAnimation
                                            end={Math.floor(stat.value / 1000)}
                                            className="tabular-nums"
                                        />
                                        <span className="mr-1">.</span>
                                        <CounterAnimation
                                            end={Math.floor((stat.value % 1000) / 100) * 100}
                                            className="tabular-nums"
                                        />
                                        {stat.value > 10000 && <span>k</span>}
                                    </>
                                ) : (
                                    <CounterAnimation end={stat.value} className="tabular-nums" />
                                )}
                            </h3>

                            <p className={cn(
                                "text-sm",
                                isDark ? "text-gray-400" : "text-gray-600"
                            )}>
                                {stat.label}
                            </p>

                            <div className={cn(
                                "absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl",
                                stat.color === "emerald" ? (isDark ? "bg-emerald-500/30" : "bg-emerald-500/20") :
                                    stat.color === "indigo" ? (isDark ? "bg-indigo-500/30" : "bg-indigo-500/20") :
                                        stat.color === "amber" ? (isDark ? "bg-amber-500/30" : "bg-amber-500/20") :
                                            (isDark ? "bg-cyan-500/30" : "bg-cyan-500/20")
                            )} />
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center"
                >
                    <p className={cn(
                        "text-sm italic",
                        isDark ? "text-gray-400" : "text-gray-600"
                    )}>
                        *Números atualizados em Junho de 2023
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
