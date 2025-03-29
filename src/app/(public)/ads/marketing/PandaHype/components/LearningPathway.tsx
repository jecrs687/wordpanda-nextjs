'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { Award, Calendar, FilmIcon, Zap } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function LearningPathway() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const steps = [
        {
            icon: <FilmIcon className="h-5 w-5" />,
            title: "Assista Filmes",
            description: "Escolha seus filmes favoritos e assista com legendas especiais.",
            color: "text-cyan-500",
            accent: isDark ? "bg-cyan-900/30" : "bg-cyan-100",
            delay: 0.1
        },
        {
            icon: <Zap className="h-5 w-5" />,
            title: "Colete Palavras",
            description: "O WordPanda identifica palavras importantes e as salva para você.",
            color: "text-amber-500",
            accent: isDark ? "bg-amber-900/30" : "bg-amber-100",
            delay: 0.2
        },
        {
            icon: <Calendar className="h-5 w-5" />,
            title: "Pratique Diariamente",
            description: "Jogos divertidos te ajudam a fixar o conteúdo com repetição espaçada.",
            color: "text-purple-500",
            accent: isDark ? "bg-purple-900/30" : "bg-purple-100",
            delay: 0.3
        },
        {
            icon: <Award className="h-5 w-5" />,
            title: "Veja Seu Progresso",
            description: "Acompanhe sua evolução e ganhe recompensas pelo seu esforço.",
            color: "text-emerald-500",
            accent: isDark ? "bg-emerald-900/30" : "bg-emerald-100",
            delay: 0.4
        }
    ];

    return (
        <section className="py-10">
            <div className="flex flex-col items-center">
                <motion.h2
                    className="text-3xl font-bold mb-4 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Como Funciona
                </motion.h2>

                <motion.p
                    className="text-center mb-8 text-zinc-600 dark:text-zinc-400 max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    Um método simples e eficaz baseado em conteúdos que você já ama.
                </motion.p>

                <motion.div
                    className="w-full max-w-md"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="relative">
                        <div className="absolute left-10 top-1 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-purple-500 to-emerald-500 z-0"></div>

                        <div className="space-y-8 relative z-10">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    className="flex gap-4"
                                    initial={{ x: -30, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.5, delay: step.delay }}
                                >
                                    <motion.div
                                        className={cn(
                                            "w-20 h-20 flex-shrink-0 rounded-full flex items-center justify-center",
                                            step.accent
                                        )}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <div className={cn(
                                            "w-14 h-14 rounded-full flex items-center justify-center",
                                            "bg-gradient-to-br from-gray-800 to-black dark:from-gray-700 dark:to-black",
                                            "shadow-lg"
                                        )}>
                                            <div className={step.color}>{step.icon}</div>
                                        </div>
                                    </motion.div>

                                    <div className={cn(
                                        "flex-1 py-2",
                                        index === steps.length - 1 ? "pb-0" : ""
                                    )}>
                                        <h3 className={cn("font-bold text-lg mb-1", step.color)}>
                                            {step.title}
                                        </h3>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
