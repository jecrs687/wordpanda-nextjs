'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const testimonials = [
    {
        quote: "Aprendi mais vocabulário em espanhol em um mês com o WordPanda do que em um ano com outros métodos. As legendas interativas são incríveis!",
        author: "Marina Silva",
        role: "Estudante Universitária",
        avatar: "MS",
        rating: 5,
        gradient: "from-emerald-500 to-cyan-500"
    },
    {
        quote: "Como professor de idiomas, recomendo o WordPanda para todos os meus alunos. A abordagem contextual realmente funciona!",
        author: "Prof. Roberto Almeida",
        role: "Professor de Inglês",
        avatar: "RA",
        rating: 5,
        gradient: "from-indigo-500 to-purple-500"
    },
    {
        quote: "Finalmente consigo entender séries em inglês sem depender totalmente das legendas. A forma como o aplicativo integra o aprendizado com entretenimento é genial.",
        author: "Carlos Mendes",
        role: "Profissional de Marketing",
        avatar: "CM",
        rating: 5,
        gradient: "from-orange-500 to-amber-500"
    },
    {
        quote: "Já tentei muitos apps de idiomas, mas o WordPanda é o único que realmente me manteve motivada. Os jogos são viciantes!",
        author: "Júlia Ferreira",
        role: "Designer Gráfica",
        avatar: "JF",
        rating: 4,
        gradient: "from-pink-500 to-rose-500"
    }
];

export default function TestimonialSlider() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        setMounted(true);

        // Auto-rotate testimonials
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    if (!mounted) return null;

    const isDark = theme === 'dark';

    return (
        <section className="py-16 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className={cn(
                    "absolute top-1/2 left-0 w-72 h-72 rounded-full blur-3xl opacity-20 -z-10 transform -translate-y-1/2",
                    isDark ? "bg-indigo-900" : "bg-indigo-100"
                )} />
                <div className={cn(
                    "absolute top-1/4 right-0 w-80 h-80 rounded-full blur-3xl opacity-20 -z-10",
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
                                ? "bg-pink-500/10 text-pink-400 border border-pink-500/20"
                                : "bg-pink-50 text-pink-700 border border-pink-100"
                        )}
                    >
                        Depoimentos
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold mb-4"
                    >
                        O que nossos{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-500">
                            usuários
                        </span>{' '}
                        dizem
                    </motion.h2>
                </div>

                <div className="max-w-4xl mx-auto">
                    {/* Current testimonial */}
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className={cn(
                            "p-8 rounded-2xl border relative mb-10",
                            isDark
                                ? "bg-gray-900/70 border-gray-800"
                                : "bg-white border-gray-200 shadow-lg"
                        )}
                    >
                        <div className={cn(
                            "absolute inset-x-8 -top-px h-px",
                            `bg-gradient-to-r ${testimonials[currentIndex].gradient}`
                        )} />

                        <div className="flex flex-col items-center text-center">
                            <div className={cn(
                                "w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6",
                                `bg-gradient-to-r ${testimonials[currentIndex].gradient}`
                            )}>
                                {testimonials[currentIndex].avatar}
                            </div>

                            <div className="mb-6">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i} className="inline-block mx-0.5">
                                        {i < testimonials[currentIndex].rating ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-amber-400">
                                                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-300 dark:text-gray-600">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                            </svg>
                                        )}
                                    </span>
                                ))}
                            </div>

                            <blockquote className="text-lg md:text-xl italic mb-6 relative">
                                <span className={cn(
                                    "absolute -top-4 -left-2 text-5xl opacity-10",
                                    isDark ? "text-gray-600" : "text-gray-300"
                                )}>
                                    "
                                </span>
                                <p className="relative z-10">
                                    {testimonials[currentIndex].quote}
                                </p>
                                <span className={cn(
                                    "absolute -bottom-8 -right-2 text-5xl opacity-10",
                                    isDark ? "text-gray-600" : "text-gray-300"
                                )}>
                                    "
                                </span>
                            </blockquote>

                            <div>
                                <h4 className="font-bold text-lg">{testimonials[currentIndex].author}</h4>
                                <p className={cn(
                                    "text-sm",
                                    isDark ? "text-gray-400" : "text-gray-600"
                                )}>
                                    {testimonials[currentIndex].role}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Navigation dots */}
                    <div className="flex justify-center gap-2">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={cn(
                                    "w-2 h-2 rounded-full transition-all duration-300",
                                    currentIndex === index
                                        ? (isDark ? "bg-white w-8" : "bg-gray-900 w-8")
                                        : (isDark ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-300 hover:bg-gray-400")
                                )}
                                aria-label={`View testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
