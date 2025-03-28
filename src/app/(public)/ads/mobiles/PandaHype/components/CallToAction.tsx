'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { ArrowRight, Gift, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function CallToAction() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const footprintPath = [
        { x: -80, y: 20, scale: 0.4, rotate: -15 },
        { x: -40, y: -10, scale: 0.5, rotate: 10 },
        { x: 20, y: 5, scale: 0.6, rotate: -5 },
        { x: 80, y: -15, scale: 0.7, rotate: 5 }
    ];

    return (
        <section className="py-16">
            <motion.div
                className={cn(
                    "w-full max-w-md mx-auto rounded-3xl overflow-hidden relative",
                    "border",
                    isDark
                        ? "bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700"
                        : "bg-gradient-to-br from-emerald-50 to-cyan-50 border-gray-200"
                )}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
            >
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className={cn(
                        "absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20",
                        "bg-gradient-to-r from-emerald-500 to-cyan-500"
                    )}></div>
                    <div className={cn(
                        "absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-20",
                        "bg-gradient-to-r from-purple-500 to-indigo-500"
                    )}></div>

                    {/* Panda footprints */}
                    {footprintPath.map((footprint, index) => (
                        <motion.div
                            key={index}
                            className="absolute"
                            style={{
                                left: `calc(50% + ${footprint.x}px)`,
                                top: `calc(50% + ${footprint.y}px)`,
                                transform: `scale(${footprint.scale}) rotate(${footprint.rotate}deg)`
                            }}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 0.2 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 + index * 0.2, duration: 0.5 }}
                        >
                            <div className="relative">
                                <div className="bg-black rounded-full w-6 h-10"></div>
                                <div className="absolute -top-3 -left-3 bg-black rounded-full w-4 h-4"></div>
                                <div className="absolute -top-3 left-5 bg-black rounded-full w-4 h-4"></div>
                                <div className="absolute -top-3 right-1 bg-black rounded-full w-4 h-4"></div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="relative z-10 p-8 md:p-10 text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center justify-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md"
                    >
                        <Gift className="h-4 w-4 text-amber-400" />
                        <span className="text-sm font-medium">Acesso gratuito limitado</span>
                    </motion.div>

                    <motion.h2
                        className="text-3xl md:text-4xl font-extrabold mb-4"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Comece Sua Aventura<br />Linguística Hoje!
                    </motion.h2>

                    <motion.p
                        className={cn(
                            "text-lg mb-8 max-w-sm mx-auto",
                            isDark ? "text-zinc-300" : "text-zinc-700"
                        )}
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Junte-se a milhares de estudantes que já transformaram o aprendizado de idiomas em algo divertido e eficaz.
                    </motion.p>

                    <div className="space-y-4">
                        <motion.button
                            className={cn(
                                "w-full flex items-center justify-center gap-2 py-4 px-8 rounded-xl font-bold text-lg",
                                "bg-gradient-to-r from-emerald-400 to-cyan-400 text-white",
                                "shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-shadow"
                            )}
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            whileHover={{
                                scale: 1.02,
                                boxShadow: isDark
                                    ? "0 20px 25px -5px rgba(16, 185, 129, 0.25), 0 8px 10px -6px rgba(16, 185, 129, 0.25)"
                                    : "0 20px 25px -5px rgba(16, 185, 129, 0.2), 0 8px 10px -6px rgba(16, 185, 129, 0.2)"
                            }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Criar Conta Grátis <ArrowRight size={20} />
                        </motion.button>

                        <motion.div
                            className="flex items-center justify-center gap-2"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <Sparkles className="h-4 w-4 text-amber-400" />
                            <span className="text-sm">Sem necessidade de cartão de crédito</span>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                className="text-center mt-12 text-sm text-zinc-500 dark:text-zinc-400"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
            >
                <p>© 2023 WordPanda. Todos os direitos reservados.</p>
                <div className="flex justify-center gap-4 mt-2">
                    <a href="#" className="hover:text-emerald-500 transition-colors">Termos</a>
                    <a href="#" className="hover:text-emerald-500 transition-colors">Privacidade</a>
                    <a href="#" className="hover:text-emerald-500 transition-colors">Contato</a>
                </div>
            </motion.div>
        </section>
    );
}
