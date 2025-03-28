'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { BookOpen, Brain, GamepadIcon, LanguagesIcon, LightbulbIcon, MessageCircle } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const features = [
    {
        icon: <LanguagesIcon className="h-6 w-6" />,
        title: "Múltiplos Idiomas",
        description: "Aprenda espanhol, inglês, francês e muitos outros idiomas com a mesma metodologia eficiente.",
        color: "violet"
    },
    {
        icon: <BookOpen className="h-6 w-6" />,
        title: "Legendas Interativas",
        description: "Explore o vocabulário diretamente das legendas dos seus filmes e séries favoritos.",
        color: "emerald"
    },
    {
        icon: <Brain className="h-6 w-6" />,
        title: "IA Personalizada",
        description: "Nosso sistema se adapta ao seu ritmo e estilo de aprendizado para máxima eficiência.",
        color: "blue"
    },
    {
        icon: <GamepadIcon className="h-6 w-6" />,
        title: "Jogos Educativos",
        description: "Fixe o vocabulário com jogos divertidos que tornam o aprendizado prazeroso.",
        color: "amber"
    },
    {
        icon: <MessageCircle className="h-6 w-6" />,
        title: "PandaAI Assistant",
        description: "Tire dúvidas e pratique conversação com nosso assistente de IA avançado.",
        color: "indigo"
    },
    {
        icon: <LightbulbIcon className="h-6 w-6" />,
        title: "Dicas Culturais",
        description: "Entenda o contexto cultural por trás das expressões para um aprendizado completo.",
        color: "rose"
    }
];

export default function AppFeatures() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = theme === 'dark';

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    const getColorClass = (color, isDark) => {
        const colorMap = {
            violet: isDark ? "bg-violet-900/20 border-violet-800/30 text-violet-400" : "bg-violet-50 border-violet-100 text-violet-600",
            emerald: isDark ? "bg-emerald-900/20 border-emerald-800/30 text-emerald-400" : "bg-emerald-50 border-emerald-100 text-emerald-600",
            blue: isDark ? "bg-blue-900/20 border-blue-800/30 text-blue-400" : "bg-blue-50 border-blue-100 text-blue-600",
            amber: isDark ? "bg-amber-900/20 border-amber-800/30 text-amber-400" : "bg-amber-50 border-amber-100 text-amber-600",
            indigo: isDark ? "bg-indigo-900/20 border-indigo-800/30 text-indigo-400" : "bg-indigo-50 border-indigo-100 text-indigo-600",
            rose: isDark ? "bg-rose-900/20 border-rose-800/30 text-rose-400" : "bg-rose-50 border-rose-100 text-rose-600",
        };
        return colorMap[color];
    };

    return (
        <section className="py-16 relative overflow-hidden" id="features">
            <div className="absolute inset-0 pointer-events-none">
                <div className={cn(
                    "absolute bottom-0 right-0 w-1/2 h-1/2 rounded-full blur-3xl opacity-20 -z-10",
                    isDark ? "bg-indigo-900" : "bg-indigo-100"
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
                                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                        )}
                    >
                        Recursos Exclusivos
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold mb-4"
                    >
                        Tudo que você precisa para{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500">
                            dominar
                        </span>{' '}
                        novos idiomas
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className={cn(
                            "max-w-2xl mx-auto text-lg",
                            isDark ? "text-zinc-300" : "text-zinc-700"
                        )}
                    >
                        O WordPanda combina tecnologia avançada, ciência cognitiva e métodos comprovados de aprendizado de idiomas
                    </motion.p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className={cn(
                                "relative p-6 rounded-2xl border backdrop-blur-sm",
                                isDark
                                    ? "bg-gray-900/50 border-gray-800 hover:bg-gray-900/70"
                                    : "bg-white/70 border-gray-200 hover:bg-white shadow-sm hover:shadow"
                            )}
                        >
                            <div
                                className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                                    getColorClass(feature.color, isDark)
                                )}
                            >
                                {feature.icon}
                            </div>

                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>

                            <p className={cn(
                                "text-sm",
                                isDark ? "text-zinc-400" : "text-zinc-600"
                            )}>
                                {feature.description}
                            </p>

                            <div className={cn(
                                "absolute top-0 right-0 w-1/2 h-1/2 -z-10 opacity-10 rounded-full blur-3xl",
                                feature.color === "violet" ? "bg-violet-600" :
                                    feature.color === "emerald" ? "bg-emerald-600" :
                                        feature.color === "blue" ? "bg-blue-600" :
                                            feature.color === "amber" ? "bg-amber-600" :
                                                feature.color === "indigo" ? "bg-indigo-600" :
                                                    "bg-rose-600"
                            )} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
