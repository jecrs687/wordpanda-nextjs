'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function LanguageProgress() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = theme === 'dark';

    const progressCategories = [
        { name: "Vocabulário", progress: 65, color: "emerald" },
        { name: "Gramática", progress: 48, color: "indigo" },
        { name: "Compreensão", progress: 72, color: "cyan" },
        { name: "Conversação", progress: 35, color: "amber" }
    ];

    const achievements = [
        {
            name: "Sequência de 7 dias",
            description: "Estude por 7 dias consecutivos",
            icon: "🔥",
            progress: 5,
            total: 7,
            color: "amber"
        },
        {
            name: "Vocabulário Nível 1",
            description: "Aprenda 100 palavras",
            icon: "📚",
            progress: 78,
            total: 100,
            color: "emerald"
        },
        {
            name: "Gramática Básica",
            description: "Complete 20 exercícios",
            icon: "🖋️",
            progress: 15,
            total: 20,
            color: "indigo"
        }
    ];

    const getColorClass = (color, theme, type) => {
        const colorMap = {
            emerald: {
                bar: theme === 'dark' ? "bg-emerald-500" : "bg-emerald-500",
                bg: theme === 'dark' ? "bg-emerald-900/30" : "bg-emerald-100",
                text: theme === 'dark' ? "text-emerald-400" : "text-emerald-600",
                border: theme === 'dark' ? "border-emerald-500/20" : "border-emerald-200",
                bgSoft: theme === 'dark' ? "bg-emerald-900/20" : "bg-emerald-50"
            },
            indigo: {
                bar: theme === 'dark' ? "bg-indigo-500" : "bg-indigo-500",
                bg: theme === 'dark' ? "bg-indigo-900/30" : "bg-indigo-100",
                text: theme === 'dark' ? "text-indigo-400" : "text-indigo-600",
                border: theme === 'dark' ? "border-indigo-500/20" : "border-indigo-200",
                bgSoft: theme === 'dark' ? "bg-indigo-900/20" : "bg-indigo-50"
            },
            cyan: {
                bar: theme === 'dark' ? "bg-cyan-500" : "bg-cyan-500",
                bg: theme === 'dark' ? "bg-cyan-900/30" : "bg-cyan-100",
                text: theme === 'dark' ? "text-cyan-400" : "text-cyan-600",
                border: theme === 'dark' ? "border-cyan-500/20" : "border-cyan-200",
                bgSoft: theme === 'dark' ? "bg-cyan-900/20" : "bg-cyan-50"
            },
            amber: {
                bar: theme === 'dark' ? "bg-amber-500" : "bg-amber-500",
                bg: theme === 'dark' ? "bg-amber-900/30" : "bg-amber-100",
                text: theme === 'dark' ? "text-amber-400" : "text-amber-600",
                border: theme === 'dark' ? "border-amber-500/20" : "border-amber-200",
                bgSoft: theme === 'dark' ? "bg-amber-900/20" : "bg-amber-50"
            }
        };

        return colorMap[color][type];
    };

    return (
        <section className="py-16 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className={cn(
                    "absolute top-0 right-0 w-1/2 h-1/2 rounded-full blur-3xl opacity-20 -z-10",
                    isDark ? "bg-purple-900" : "bg-purple-100"
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
                                ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                : "bg-purple-50 text-purple-700 border border-purple-100"
                        )}
                    >
                        Acompanhe Seu Progresso
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold mb-4"
                    >
                        Visualize sua{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                            evolução
                        </span>{' '}
                        de forma clara
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className={cn(
                            "max-w-2xl mx-auto text-lg mb-8",
                            isDark ? "text-zinc-300" : "text-zinc-700"
                        )}
                    >
                        Acompanhe cada etapa do seu aprendizado e celebre suas conquistas com métricas detalhadas
                    </motion.p>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                    {/* Progress Dashboard */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2"
                    >
                        <div className={cn(
                            "rounded-2xl p-6 border backdrop-blur-sm",
                            isDark ? "bg-gray-900/50 border-gray-800" : "bg-white/70 border-gray-200 shadow-sm"
                        )}>
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold mb-2">Espanhol</h3>
                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        "px-2 py-1 rounded-md text-xs font-medium",
                                        isDark ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-100 text-emerald-700"
                                    )}>
                                        Nível Intermediário
                                    </div>
                                    <div className={cn(
                                        "px-2 py-1 rounded-md text-xs font-medium",
                                        isDark ? "bg-amber-900/30 text-amber-400" : "bg-amber-100 text-amber-700"
                                    )}>
                                        58% Completo
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {progressCategories.map((category, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    "w-3 h-3 rounded-full",
                                                    getColorClass(category.color, isDark ? 'dark' : 'light', 'bar')
                                                )} />
                                                <span className="font-medium">{category.name}</span>
                                            </div>
                                            <span className={cn(
                                                "text-sm font-semibold",
                                                getColorClass(category.color, isDark ? 'dark' : 'light', 'text')
                                            )}>
                                                {category.progress}%
                                            </span>
                                        </div>
                                        <div className={cn(
                                            "h-2 w-full rounded-full overflow-hidden",
                                            getColorClass(category.color, isDark ? 'dark' : 'light', 'bg')
                                        )}>
                                            <motion.div
                                                className={cn(
                                                    "h-full rounded-full",
                                                    getColorClass(category.color, isDark ? 'dark' : 'light', 'bar')
                                                )}
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${category.progress}%` }}
                                                transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                                                viewport={{ once: true }}
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                                <h4 className="font-semibold mb-4">Atividade Recente</h4>
                                <div className="space-y-2">
                                    {[
                                        { day: "Hoje", minutes: 23, words: 12 },
                                        { day: "Ontem", minutes: 15, words: 8 },
                                        { day: "Segunda", minutes: 30, words: 15 }
                                    ].map((day, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center py-2"
                                        >
                                            <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                                                {day.day}
                                            </span>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm">
                                                    <span className="font-semibold">{day.minutes}</span> min
                                                </span>
                                                <span className="text-sm">
                                                    <span className="font-semibold">{day.words}</span> palavras
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Achievement cards */}
                    <div className="lg:w-1/2">
                        <div className="space-y-4">
                            {achievements.map((achievement, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                    className={cn(
                                        "p-5 rounded-xl border",
                                        isDark
                                            ? "bg-gray-900/50 border-gray-800 hover:bg-gray-900/70"
                                            : "bg-white/70 border-gray-200 hover:bg-white shadow-sm hover:shadow"
                                    )}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center text-xl",
                                            getColorClass(achievement.color, isDark ? 'dark' : 'light', 'bgSoft'),
                                            getColorClass(achievement.color, isDark ? 'dark' : 'light', 'text')
                                        )}>
                                            {achievement.icon}
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold">{achievement.name}</h3>
                                            <p className={cn(
                                                "text-sm mb-3",
                                                isDark ? "text-gray-400" : "text-gray-600"
                                            )}>
                                                {achievement.description}
                                            </p>

                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-medium">{achievement.progress}/{achievement.total}</span>
                                                <span className="text-xs font-medium">
                                                    {Math.round((achievement.progress / achievement.total) * 100)}%
                                                </span>
                                            </div>

                                            <div className={cn(
                                                "h-2 w-full rounded-full overflow-hidden",
                                                getColorClass(achievement.color, isDark ? 'dark' : 'light', 'bg')
                                            )}>
                                                <motion.div
                                                    className={cn(
                                                        "h-full rounded-full",
                                                        getColorClass(achievement.color, isDark ? 'dark' : 'light', 'bar')
                                                    )}
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                                                    transition={{ duration: 1, delay: 0.2 }}
                                                    viewport={{ once: true }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <motion.div
                                        className="mt-4 flex justify-end"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ duration: 0.3, delay: 0.8 + (index * 0.1) }}
                                        viewport={{ once: true }}
                                    >
                                        <button className={cn(
                                            "text-xs px-3 py-1.5 rounded-full",
                                            getColorClass(achievement.color, isDark ? 'dark' : 'light', 'bgSoft'),
                                            getColorClass(achievement.color, isDark ? 'dark' : 'light', 'text')
                                        )}>
                                            Continuar
                                        </button>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
