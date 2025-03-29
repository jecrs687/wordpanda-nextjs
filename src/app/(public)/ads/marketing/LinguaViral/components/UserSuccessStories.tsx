'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function UserSuccessStories() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [activeStory, setActiveStory] = useState(0);

    // Move testimonials array before useEffect to fix "Cannot access 'testimonials' before initialization" error
    const testimonials = [
        {
            name: "Juliana Martins",
            role: "Estudante Universitária",
            avatar: "JM",
            story: "Em 3 meses com o WordPanda, consegui subir de nível no meu curso de inglês e agora estou muito mais confiante nas conversas com estrangeiros. Os desafios virais são viciantes!",
            stats: [
                { label: "Palavras Aprendidas", value: "1,248" },
                { label: "Streak", value: "43 dias" },
                { label: "Desafios", value: "12" }
            ],
            rating: 5,
            color: "purple"
        },
        {
            name: "Ricardo Silva",
            role: "Profissional de Marketing",
            avatar: "RS",
            story: "Precisava urgentemente melhorar meu espanhol para uma promoção no trabalho. Com o WordPanda, consegui aprender vocabulário de negócios em tempo recorde. Fui promovido e ainda uso o app todos os dias!",
            stats: [
                { label: "Palavras Aprendidas", value: "3,587" },
                { label: "Streak", value: "128 dias" },
                { label: "Desafios", value: "35" }
            ],
            rating: 5,
            color: "cyan"
        },
        {
            name: "Mariana Costa",
            role: "Professora de Idiomas",
            avatar: "MC",
            story: "Como professora, recomendo o WordPanda para todos os meus alunos. A abordagem viral e competitiva é perfeita para motivar os jovens. Os resultados são impressionantes e a retenção de vocabulário é muito superior a outros métodos.",
            stats: [
                { label: "Palavras Aprendidas", value: "5,124" },
                { label: "Streak", value: "302 dias" },
                { label: "Desafios", value: "87" }
            ],
            rating: 5,
            color: "amber"
        }
    ];

    useEffect(() => {
        setMounted(true);

        // Auto-rotate testimonials
        const interval = setInterval(() => {
            setActiveStory(prev => (prev + 1) % testimonials.length);
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    if (!mounted) return null;

    const isDark = theme === 'dark';

    const getColors = (color, isDark) => {
        const colorMap = {
            purple: {
                bg: isDark ? "bg-purple-900/20" : "bg-purple-50",
                border: isDark ? "border-purple-800/30" : "border-purple-100",
                text: isDark ? "text-purple-400" : "text-purple-700",
                gradient: "from-purple-500 to-pink-500"
            },
            cyan: {
                bg: isDark ? "bg-cyan-900/20" : "bg-cyan-50",
                border: isDark ? "border-cyan-800/30" : "border-cyan-100",
                text: isDark ? "text-cyan-400" : "text-cyan-700",
                gradient: "from-cyan-500 to-blue-500"
            },
            amber: {
                bg: isDark ? "bg-amber-900/20" : "bg-amber-50",
                border: isDark ? "border-amber-800/30" : "border-amber-100",
                text: isDark ? "text-amber-400" : "text-amber-700",
                gradient: "from-amber-500 to-orange-500"
            }
        };

        return colorMap[color];
    };

    return (
        <section className="py-16 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className={cn(
                    "absolute top-0 left-0 w-1/2 h-1/2 rounded-full blur-3xl opacity-20 -z-10",
                    isDark ? "bg-amber-900" : "bg-amber-100"
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
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-amber-50 text-amber-700 border border-amber-100"
                        )}
                    >
                        <Star className="w-4 h-4 fill-current" />
                        <span>Histórias de Sucesso</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold mb-4"
                    >
                        Experiências{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-500">
                            transformadoras
                        </span>{' '}
                        com o WordPanda
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
                        Descubra como nossos usuários estão revolucionando seu aprendizado de idiomas e alcançando fluência de forma divertida e eficiente
                    </motion.p>
                </div>

                <div className="max-w-4xl mx-auto">
                    {/* Main testimonial */}
                    <motion.div
                        key={activeStory}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className={cn(
                            "p-6 rounded-2xl border mb-8 relative",
                            isDark ? "bg-gray-900/50 border-gray-800" : "bg-white/90 border-gray-200 shadow-lg"
                        )}
                    >
                        <div className="absolute -top-4 -right-4 rotate-12">
                            <Quote className={cn(
                                "w-8 h-8 opacity-50",
                                isDark ? "text-gray-700" : "text-gray-300"
                            )} />
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="md:w-1/3 flex flex-col items-center text-center">
                                <div className={cn(
                                    "w-20 h-20 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4",
                                    `bg-gradient-to-br ${getColors(testimonials[activeStory].color, isDark).gradient}`
                                )}>
                                    {testimonials[activeStory].avatar}
                                </div>

                                <h3 className="text-lg font-bold">{testimonials[activeStory].name}</h3>
                                <p className={cn(
                                    "text-sm mb-4",
                                    isDark ? "text-gray-400" : "text-gray-600"
                                )}>
                                    {testimonials[activeStory].role}
                                </p>

                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={cn(
                                                "w-4 h-4",
                                                i < testimonials[activeStory].rating
                                                    ? "text-amber-500 fill-amber-500"
                                                    : "text-gray-300 dark:text-gray-700"
                                            )}
                                        />
                                    ))}
                                </div>

                                <div className="p-3 rounded-lg w-full space-y-2">
                                    {testimonials[activeStory].stats.map((stat, idx) => (
                                        <div key={idx} className="text-center">
                                            <div className={cn(
                                                "text-base font-bold",
                                                getColors(testimonials[activeStory].color, isDark).text
                                            )}>
                                                {stat.value}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {stat.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="md:w-2/3">
                                <div className={cn(
                                    "p-4 rounded-xl mb-4 border-l-4",
                                    getColors(testimonials[activeStory].color, isDark).bg,
                                    isDark
                                        ? `border-l-${testimonials[activeStory].color}-500 border-${testimonials[activeStory].color}-800/30`
                                        : `border-l-${testimonials[activeStory].color}-500 border-${testimonials[activeStory].color}-100`
                                )}>
                                    <p className="text-lg italic mb-2">
                                        "{testimonials[activeStory].story}"
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {[
                                        "Aprendizado Viral",
                                        "Vocabulário Relevante",
                                        "Método Eficiente",
                                        "Competições Divertidas"
                                    ].map((tag, idx) => (
                                        <div
                                            key={idx}
                                            className={cn(
                                                "px-3 py-1 rounded-full text-xs",
                                                isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
                                            )}
                                        >
                                            {tag}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <motion.div
                            className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1/2 h-1.5 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                repeatType: "loop"
                            }}
                        >
                            <div className={cn(
                                "h-full rounded-full",
                                `bg-gradient-to-r ${getColors(testimonials[activeStory].color, isDark).gradient}`
                            )} />
                        </motion.div>
                    </motion.div>

                    {/* Testimonial selection */}
                    <div className="flex justify-center gap-3">
                        {testimonials.map((_, idx) => (
                            <button
                                key={idx}
                                className={cn(
                                    "w-3 h-3 rounded-full transition-all",
                                    activeStory === idx
                                        ? `w-8 bg-gradient-to-r ${getColors(testimonials[idx].color, isDark).gradient}`
                                        : (isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-300 hover:bg-gray-400")
                                )}
                                onClick={() => setActiveStory(idx)}
                                aria-label={`View testimonial ${idx + 1}`}
                            />
                        ))}
                    </div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4"
                    >
                        {[
                            { value: "93%", label: "de usuários relatam melhora na fluência" },
                            { value: "4.8", label: "nota média na App Store" },
                            { value: "87%", label: "menos desistência nos estudos" },
                            { value: "30+", label: "novas palavras por dia em média" }
                        ].map((stat, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "p-4 rounded-xl text-center",
                                    isDark ? "bg-gray-900/70 border border-gray-800" : "bg-white/80 border border-gray-200"
                                )}
                            >
                                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
