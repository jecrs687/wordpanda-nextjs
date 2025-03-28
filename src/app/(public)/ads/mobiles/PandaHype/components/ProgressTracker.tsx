'use client';

import { cn } from '@utils/utils';
import { motion, useAnimation } from 'framer-motion';
import { ChartBar, TrendingUp } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ProgressTracker() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const controls = useAnimation();
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const animateProgress = async () => {
            // Start animation
            await controls.start({
                width: '70%',
                transition: { duration: 1.5, ease: "easeOut" }
            });

            // Update percentage
            const interval = setInterval(() => {
                setPercentage(prev => {
                    if (prev >= 70) {
                        clearInterval(interval);
                        return 70;
                    }
                    return prev + 1;
                });
            }, 15);

            return () => clearInterval(interval);
        };

        timeout = setTimeout(animateProgress, 500);

        return () => {
            clearTimeout(timeout);
        };
    }, [controls]);

    const stats = [
        { label: "Palavras Aprendidas", value: "238" },
        { label: "Dias Consecutivos", value: "7" },
        { label: "Nível Atual", value: "Intermediário" },
        { label: "Próxima Meta", value: "350 palavras" }
    ];

    return (
        <section className="py-10">
            <div className="flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-500"
                >
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">Progresso Visível</span>
                </motion.div>

                <motion.h2
                    className="text-3xl font-bold mb-4 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Seu Caminho para a Fluência
                </motion.h2>

                <motion.p
                    className="text-center mb-8 text-zinc-600 dark:text-zinc-400 max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    Acompanhe seu progresso em tempo real e veja o quanto você já evoluiu no seu aprendizado.
                </motion.p>

                <motion.div
                    className={cn(
                        "w-full max-w-md rounded-2xl border p-6",
                        isDark
                            ? "bg-gray-900/60 border-gray-800 backdrop-blur-xl"
                            : "bg-white/80 border-gray-200 backdrop-blur-xl"
                    )}
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <ChartBar className="h-5 w-5 text-amber-500" />
                            <h3 className="text-lg font-semibold">Progresso do Português</h3>
                        </div>
                        <span className="text-xs py-1 px-2 rounded-full bg-amber-500/20 text-amber-500">
                            Avançando rápido
                        </span>
                    </div>

                    <div className="mb-8">
                        <div className="flex justify-between text-sm mb-2">
                            <span>Nível A1-A2</span>
                            <div className="flex items-center">
                                <span className="font-medium text-amber-500">{percentage}%</span>
                                <span className="text-zinc-500 dark:text-zinc-400 ml-1">completo</span>
                            </div>
                        </div>

                        <div className={cn(
                            "w-full h-4 rounded-full overflow-hidden",
                            isDark ? "bg-gray-800" : "bg-gray-200"
                        )}>
                            <motion.div
                                className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                                initial={{ width: '0%' }}
                                animate={controls}
                            />
                        </div>

                        <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                            <span>Iniciante</span>
                            <span>Intermediário</span>
                            <span>Avançado</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                className={cn(
                                    "p-3 rounded-lg",
                                    isDark ? "bg-gray-800" : "bg-gray-100"
                                )}
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">{stat.label}</p>
                                <p className="font-semibold">{stat.value}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-zinc-600 dark:text-zinc-400">
                                Última atualização: Hoje
                            </span>
                            <motion.button
                                className="text-emerald-500 font-medium hover:text-emerald-600 dark:hover:text-emerald-400"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Ver Detalhes
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
