'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CallToAction() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = theme === 'dark';

    const features = [
        "Legendas interativas que ensinam vocabulário em contexto",
        "Jogos inteligentes para fixação do aprendizado",
        "Assistente de IA para tirar dúvidas em tempo real",
        "Acompanhamento detalhado do seu progresso"
    ];

    return (
        <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className={cn(
                    "absolute inset-0 opacity-30",
                    isDark
                        ? "bg-gradient-to-br from-indigo-950 via-gray-950 to-emerald-950"
                        : "bg-gradient-to-br from-indigo-50 via-gray-50 to-emerald-50"
                )} />

                <div className={cn(
                    "absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-px",
                    "bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"
                )} />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <div className={cn(
                        "rounded-3xl overflow-hidden border backdrop-blur-sm",
                        isDark
                            ? "bg-gray-900/70 border-gray-800"
                            : "bg-white/90 border-gray-200 shadow-xl"
                    )}>
                        <div className={cn(
                            "p-2",
                            "bg-gradient-to-r from-emerald-500 to-cyan-500"
                        )}>
                            <div className={cn(
                                "p-6 rounded-2xl",
                                isDark ? "bg-gray-900" : "bg-white"
                            )}>
                                <div className="text-center mb-10">
                                    <motion.h2
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        viewport={{ once: true }}
                                        className="text-3xl md:text-4xl font-extrabold mb-4"
                                    >
                                        Pronto para{' '}
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">
                                            revolucionar
                                        </span>{' '}
                                        seu aprendizado?
                                    </motion.h2>

                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.1 }}
                                        viewport={{ once: true }}
                                        className={cn(
                                            "text-lg md:text-xl mb-8",
                                            isDark ? "text-zinc-300" : "text-zinc-700"
                                        )}
                                    >
                                        Junte-se a milhares de estudantes e transforme filmes e séries em poderosas ferramentas de aprendizado
                                    </motion.p>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        viewport={{ once: true }}
                                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
                                    >
                                        <Link href="/register">
                                            <motion.button
                                                whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                                                whileTap={{ scale: 0.97 }}
                                                className={cn(
                                                    "px-8 py-4 rounded-xl font-medium text-white shadow-lg w-full sm:w-auto",
                                                    "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600",
                                                    "transition-all duration-300 flex items-center justify-center gap-2"
                                                )}
                                            >
                                                Começar gratuitamente
                                                <ArrowRight className="h-5 w-5" />
                                            </motion.button>
                                        </Link>

                                        <p className={cn(
                                            "text-sm",
                                            isDark ? "text-gray-400" : "text-gray-600"
                                        )}>
                                            Não é necessário cartão de crédito
                                        </p>
                                    </motion.div>

                                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                                        {features.map((feature, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 10 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
                                                viewport={{ once: true }}
                                                className="flex items-center gap-2"
                                            >
                                                <div className={cn(
                                                    "w-5 h-5 rounded-full flex items-center justify-center",
                                                    isDark ? "bg-emerald-900/50 text-emerald-400" : "bg-emerald-100 text-emerald-600"
                                                )}>
                                                    <Check className="h-3 w-3" />
                                                </div>
                                                <span className={cn(
                                                    "text-sm",
                                                    isDark ? "text-gray-300" : "text-gray-700"
                                                )}>
                                                    {feature}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div className={cn(
                                    "p-4 rounded-xl",
                                    isDark ? "bg-gray-800/50" : "bg-gray-50"
                                )}>
                                    <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="flex -space-x-2">
                                                    {["bg-pink-500", "bg-indigo-500", "bg-amber-500", "bg-emerald-500"].map((color, i) => (
                                                        <div
                                                            key={i}
                                                            className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white text-xs border-2 ${isDark ? "border-gray-800" : "border-white"}`}
                                                        >
                                                            {String.fromCharCode(65 + i)}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className={cn(
                                                "px-3 py-1 rounded-full text-xs font-medium",
                                                isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
                                            )}>
                                                +1.200 hoje
                                            </div>
                                        </div>
                                        <p className={cn(
                                            "text-sm",
                                            isDark ? "text-gray-400" : "text-gray-600"
                                        )}>
                                            Junte-se a mais de 12.000 usuários que já estão aprendendo com WordPanda
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <p className={cn(
                            "text-sm",
                            isDark ? "text-gray-500" : "text-gray-400"
                        )}>
                            © 2023 WordPanda. Todos os direitos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
