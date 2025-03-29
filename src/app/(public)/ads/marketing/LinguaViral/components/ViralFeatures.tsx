'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { Award, Flame, Globe, Share2, Users, Zap } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const features = [
    {
        icon: <Flame className="h-6 w-6" />,
        title: "Desafios Diários",
        description: "Complete sequências de exercícios para manter sua pontuação e subir no ranking.",
        color: "orange"
    },
    {
        icon: <Users className="h-6 w-6" />,
        title: "Competições com Amigos",
        description: "Convide seus amigos e participe de competições semanais com prêmios exclusivos.",
        color: "cyan"
    },
    {
        icon: <Globe className="h-6 w-6" />,
        title: "Conteúdo Viral",
        description: "Aprenda com memes, vídeos e expressões que estão bombando no mundo todo.",
        color: "purple"
    },
    {
        icon: <Award className="h-6 w-6" />,
        title: "Conquistas Exclusivas",
        description: "Desbloqueie medalhas e prêmios virtuais ao completar metas de aprendizado.",
        color: "yellow"
    },
    {
        icon: <Share2 className="h-6 w-6" />,
        title: "Compartilhamento Social",
        description: "Compartilhe seus resultados e desafie seus amigos nas redes sociais.",
        color: "pink"
    },
    {
        icon: <Zap className="h-6 w-6" />,
        title: "Modo Streak",
        description: "Mantenha sua sequência diária para multiplicar seus pontos e recompensas.",
        color: "green"
    }
];

export default function ViralFeatures() {
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
            orange: isDark ? "bg-orange-900/20 border-orange-800/30 text-orange-400" : "bg-orange-50 border-orange-100 text-orange-600",
            cyan: isDark ? "bg-cyan-900/20 border-cyan-800/30 text-cyan-400" : "bg-cyan-50 border-cyan-100 text-cyan-600",
            purple: isDark ? "bg-purple-900/20 border-purple-800/30 text-purple-400" : "bg-purple-50 border-purple-100 text-purple-600",
            yellow: isDark ? "bg-yellow-900/20 border-yellow-800/30 text-yellow-400" : "bg-yellow-50 border-yellow-100 text-yellow-600",
            pink: isDark ? "bg-pink-900/20 border-pink-800/30 text-pink-400" : "bg-pink-50 border-pink-100 text-pink-600",
            green: isDark ? "bg-emerald-900/20 border-emerald-800/30 text-emerald-400" : "bg-emerald-50 border-emerald-100 text-emerald-600",
        };
        return colorMap[color];
    };

    return (
        <section className="py-16 relative overflow-hidden" id="features">
            <div className="absolute inset-0 pointer-events-none">
                <div className={cn(
                    "absolute bottom-0 right-0 w-1/2 h-1/2 rounded-full blur-3xl opacity-20 -z-10",
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
                        Recursos Virais
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold mb-4"
                    >
                        Aprenda idiomas como se fosse um{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
                            jogo viral
                        </span>
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
                        O WordPanda transforma o aprendizado de idiomas em uma experiência social e divertida que você vai querer compartilhar
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
                                "relative p-6 rounded-xl border backdrop-blur-sm",
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

                            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>

                            <p className={cn(
                                "text-sm",
                                isDark ? "text-zinc-400" : "text-zinc-600"
                            )}>
                                {feature.description}
                            </p>

                            <div className={cn(
                                "absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold",
                                isDark
                                    ? "bg-gray-800 text-white border border-gray-700"
                                    : "bg-white text-gray-900 border border-gray-200 shadow-sm"
                            )}>
                                {index + 1}
                            </div>

                            <div className={cn(
                                "absolute top-0 right-0 w-1/2 h-1/2 -z-10 opacity-10 rounded-full blur-3xl",
                                feature.color === "orange" ? "bg-orange-600" :
                                    feature.color === "cyan" ? "bg-cyan-600" :
                                        feature.color === "purple" ? "bg-purple-600" :
                                            feature.color === "yellow" ? "bg-yellow-600" :
                                                feature.color === "pink" ? "bg-pink-600" :
                                                    "bg-emerald-600"
                            )} />
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center"
                >
                    <span className={cn(
                        "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
                        isDark
                            ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                            : "bg-cyan-50 text-cyan-700 border border-cyan-100"
                    )}>
                        <Flame className="h-4 w-4" />
                        <span>Mais de 500 mil desafios completados por dia</span>
                    </span>
                </motion.div>
            </div>
        </section>
    );
}
