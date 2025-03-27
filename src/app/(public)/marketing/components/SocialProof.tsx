'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';

const testimonials = [
    {
        quote: "O WordPanda transformou completamente minha experiência de aprendizado. Em apenas 3 meses, já consigo manter conversas básicas em espanhol!",
        author: "Mariana Silva",
        role: "Estudante Universitária",
        avatar: "MS",
        gradient: "from-pink-500 to-purple-500"
    },
    {
        quote: "Os jogos interativos e o sistema de repetição espaçada fizeram toda a diferença no meu aprendizado. O idioma parece fluir naturalmente agora.",
        author: "Carlos Eduardo",
        role: "Desenvolvedor de Software",
        avatar: "CE",
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        quote: "Como professor, recomendo o WordPanda para todos os meus alunos. A metodologia é cientificamente embasada e os resultados são impressionantes.",
        author: "Prof. Roberto Almeida",
        role: "Doutor em Linguística",
        avatar: "RA",
        gradient: "from-emerald-500 to-green-500"
    },
    {
        quote: "Finalmente encontrei uma plataforma que se adapta ao meu ritmo. O assistente de IA personaliza as lições perfeitamente para minhas necessidades.",
        author: "Juliana Costa",
        role: "Profissional de Marketing",
        avatar: "JC",
        gradient: "from-amber-500 to-orange-500"
    },
    {
        quote: "Aprender mandarim parecia impossível até eu descobrir o WordPanda. A abordagem visual e os exercícios práticos tornam tudo mais acessível.",
        author: "Ricardo Mendes",
        role: "Empresário",
        avatar: "RM",
        gradient: "from-red-500 to-rose-500"
    },
    {
        quote: "Uso a plataforma há 6 meses e já consegui uma promoção no trabalho por causa da minha fluência em inglês. Melhor investimento que já fiz!",
        author: "Fernanda Lima",
        role: "Analista de Comércio Exterior",
        avatar: "FL",
        gradient: "from-violet-500 to-purple-500"
    }
];

export const SocialProof = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className="py-20 px-4 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
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
                        Depoimentos
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold mb-6"
                    >
                        O que nossos <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">alunos</span> dizem
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className={cn(
                            "max-w-3xl mx-auto text-lg mb-12",
                            isDark ? "text-zinc-300" : "text-zinc-700"
                        )}
                    >
                        Milhares de estudantes já transformaram sua jornada de aprendizado com o WordPanda
                    </motion.p>
                </div>

                <div className="flex flex-col items-center">
                    {/* Featured testimonial */}
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className={cn(
                            "max-w-4xl mx-auto p-8 rounded-2xl mb-10 relative",
                            isDark
                                ? "bg-gray-900/60 backdrop-blur-sm border border-gray-800/60"
                                : "bg-white backdrop-blur-sm border border-gray-200/60 shadow-xl shadow-gray-200/20"
                        )}
                    >
                        <div className="absolute -top-5 left-10 text-purple-500 dark:text-purple-400">
                            <Quote size={40} className="opacity-50" />
                        </div>

                        <div className="pt-3">
                            <p className={cn(
                                "text-xl md:text-2xl italic font-medium leading-relaxed mb-8",
                                isDark ? "text-gray-300" : "text-gray-700"
                            )}>
                                "{testimonials[activeIndex].quote}"
                            </p>

                            <div className="flex items-center">
                                <div className={cn(
                                    `w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-4 bg-gradient-to-br ${testimonials[activeIndex].gradient}`
                                )}>
                                    {testimonials[activeIndex].avatar}
                                </div>

                                <div>
                                    <h4 className="font-bold">{testimonials[activeIndex].author}</h4>
                                    <p className={cn(
                                        "text-sm",
                                        isDark ? "text-gray-400" : "text-gray-600"
                                    )}>
                                        {testimonials[activeIndex].role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Testimonial navigation dots */}
                    <div className="flex space-x-2 mb-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={cn(
                                    "w-3 h-3 rounded-full transition-all duration-300",
                                    index === activeIndex
                                        ? (isDark ? "bg-purple-500 scale-125" : "bg-purple-600 scale-125")
                                        : (isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-300 hover:bg-gray-400")
                                )}
                                aria-label={`Ver depoimento ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Testimonial cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                        {testimonials.slice(0, 3).map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5 }}
                                className={cn(
                                    "p-6 rounded-xl border",
                                    isDark
                                        ? "bg-gray-900/40 backdrop-blur-sm border-gray-800/60"
                                        : "bg-white backdrop-blur-sm border-gray-200/60 shadow-lg shadow-gray-200/10"
                                )}
                            >
                                <div className="flex items-start mb-4">
                                    <div className={cn(
                                        `w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3 bg-gradient-to-br ${testimonial.gradient}`
                                    )}>
                                        {testimonial.avatar}
                                    </div>

                                    <div>
                                        <h4 className="font-bold">{testimonial.author}</h4>
                                        <p className={cn(
                                            "text-sm",
                                            isDark ? "text-gray-400" : "text-gray-600"
                                        )}>
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>

                                <p className={cn(
                                    "text-sm leading-relaxed",
                                    isDark ? "text-gray-400" : "text-gray-600"
                                )}>
                                    "{testimonial.quote.substring(0, 120)}..."
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.a
                        href="/marketing/testimonials"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        viewport={{ once: true }}
                        className={cn(
                            "mt-10 px-6 py-3 rounded-lg text-sm font-medium inline-flex items-center gap-2",
                            isDark
                                ? "bg-white/10 hover:bg-white/20 text-white"
                                : "bg-purple-50 hover:bg-purple-100 text-purple-700"
                        )}
                    >
                        Ver todos os depoimentos
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right">
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                        </svg>
                    </motion.a>
                </div>
            </div>
        </section>
    );
};
