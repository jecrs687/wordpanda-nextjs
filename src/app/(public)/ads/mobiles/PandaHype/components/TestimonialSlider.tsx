'use client';

import { cn } from '@utils/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MessageSquareQuote, Star } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

type Testimonial = {
    id: number;
    quote: string;
    author: string;
    role: string;
    avatar: string;
    rating: number;
    gradientFrom: string;
    gradientTo: string;
};

export default function TestimonialSlider() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const testimonials: Testimonial[] = [
        {
            id: 1,
            quote: "Aprendi 46 palavras em um único filme! Agora consigo entender diálogos que antes pareciam impossíveis.",
            author: "Carolina Silva",
            role: "Estudante de Inglês",
            avatar: "CS",
            rating: 5,
            gradientFrom: "from-emerald-400",
            gradientTo: "to-cyan-400"
        },
        {
            id: 2,
            quote: "O método de aprendizado através de filmes é revolucionário. Em 3 meses já consigo manter conversas básicas em espanhol!",
            author: "Pedro Henrique",
            role: "Profissional de TI",
            avatar: "PH",
            rating: 5,
            gradientFrom: "from-blue-400",
            gradientTo: "to-indigo-400"
        },
        {
            id: 3,
            quote: "Depois de tentar vários métodos sem sucesso, o WordPanda tornou o aprendizado de idiomas finalmente divertido e eficaz.",
            author: "Mariana Costa",
            role: "Viajante",
            avatar: "MC",
            rating: 4,
            gradientFrom: "from-amber-400",
            gradientTo: "to-orange-400"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            nextTestimonial();
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    const nextTestimonial = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 200 : -200,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -200 : 200,
            opacity: 0
        })
    };

    return (
        <section className="py-10">
            <div className="flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-500"
                >
                    <MessageSquareQuote className="h-4 w-4" />
                    <span className="text-sm font-medium">Depoimentos</span>
                </motion.div>

                <motion.h2
                    className="text-3xl font-bold mb-4 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    O Que Nossos Usuários Dizem
                </motion.h2>

                <motion.p
                    className="text-center mb-8 text-zinc-600 dark:text-zinc-400 max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    Milhares de pessoas já transformaram seu aprendizado de idiomas com o WordPanda.
                </motion.p>

                <div className="w-full max-w-md mb-10">
                    <div className="relative">
                        <AnimatePresence custom={direction} mode="wait">
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.5, type: "tween" }}
                                className={cn(
                                    "w-full rounded-2xl p-6 shadow-lg",
                                    "border",
                                    isDark
                                        ? "bg-gray-900/80 border-gray-800 backdrop-blur-xl"
                                        : "bg-white/90 border-gray-200 backdrop-blur-xl"
                                )}
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className={cn(
                                        "w-16 h-16 rounded-full mb-4 flex items-center justify-center text-white font-bold",
                                        "bg-gradient-to-br",
                                        testimonials[currentIndex].gradientFrom,
                                        testimonials[currentIndex].gradientTo
                                    )}>
                                        {testimonials[currentIndex].avatar}
                                    </div>

                                    <div className="flex mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={cn(
                                                    "w-4 h-4",
                                                    i < testimonials[currentIndex].rating
                                                        ? "text-yellow-400 fill-yellow-400"
                                                        : "text-gray-300 dark:text-gray-600"
                                                )}
                                            />
                                        ))}
                                    </div>

                                    <p className="text-lg italic mb-6">
                                        "{testimonials[currentIndex].quote}"
                                    </p>

                                    <div>
                                        <h4 className="font-bold">{testimonials[currentIndex].author}</h4>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                            {testimonials[currentIndex].role}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex justify-between mt-5">
                            <button
                                onClick={prevTestimonial}
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center",
                                    isDark
                                        ? "bg-gray-800 hover:bg-gray-700 text-white"
                                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                                )}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div className="flex gap-1 items-center">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setDirection(index > currentIndex ? 1 : -1);
                                            setCurrentIndex(index);
                                        }}
                                        className={cn(
                                            "w-2 h-2 rounded-full transition-all",
                                            index === currentIndex
                                                ? "w-6 bg-purple-500"
                                                : isDark
                                                    ? "bg-gray-700 hover:bg-gray-600"
                                                    : "bg-gray-300 hover:bg-gray-400"
                                        )}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={nextTestimonial}
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center",
                                    isDark
                                        ? "bg-gray-800 hover:bg-gray-700 text-white"
                                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                                )}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
