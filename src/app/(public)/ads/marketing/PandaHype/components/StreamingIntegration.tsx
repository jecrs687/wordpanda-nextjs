'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function StreamingIntegration() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const platforms = [
        {
            name: "Prime Video",
            color: "bg-blue-600",
            active: true,
            delay: 0
        },
        {
            name: "Netflix",
            color: "bg-red-600",
            active: false,
            delay: 0.1,
            comingSoon: true
        },
        {
            name: "Disney+",
            color: "bg-indigo-600",
            active: false,
            delay: 0.2,
            comingSoon: true
        },
        {
            name: "HBO Max",
            color: "bg-purple-600",
            active: false,
            delay: 0.3,
            comingSoon: true
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
                    Integração com Plataformas
                </motion.h2>

                <motion.p
                    className="text-center mb-8 text-zinc-600 dark:text-zinc-400 max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    O WordPanda se integra com suas plataformas de streaming favoritas para capturar palavras das legendas.
                </motion.p>

                <motion.div
                    className={cn(
                        "w-full max-w-md rounded-2xl p-6",
                        "border",
                        isDark
                            ? "bg-gray-900/60 border-gray-800 backdrop-blur-xl"
                            : "bg-white/80 border-gray-200 backdrop-blur-xl"
                    )}
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h3 className="text-xl font-semibold mb-4">Plataformas Disponíveis</h3>

                    <div className="space-y-3">
                        {platforms.map((platform, index) => (
                            <motion.div
                                key={index}
                                className={cn(
                                    "flex items-center justify-between p-3 rounded-lg",
                                    isDark
                                        ? "bg-gray-800/50 hover:bg-gray-800"
                                        : "bg-gray-100/80 hover:bg-gray-200/80",
                                    "cursor-pointer transition-colors duration-200"
                                )}
                                initial={{ x: -20, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: platform.delay }}
                                whileHover={{ x: 5 }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center text-white",
                                        platform.color
                                    )}>
                                        <span className="text-xs font-bold">{platform.name.substring(0, 2)}</span>
                                    </div>
                                    <div>
                                        <p className="font-medium">{platform.name}</p>
                                        {platform.comingSoon && (
                                            <span className="text-xs text-amber-500 dark:text-amber-400">
                                                Em breve
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {platform.active ? (
                                    <span className="text-xs py-1 px-2 rounded-full bg-emerald-500/20 text-emerald-500">
                                        Ativo
                                    </span>
                                ) : (
                                    <span className="text-xs py-1 px-2 rounded-full bg-gray-500/20 text-gray-500">
                                        Indisponível
                                    </span>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                    >
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                            Mais plataformas em breve
                        </span>

                        <motion.button
                            className={cn(
                                "flex items-center gap-1 text-sm font-medium",
                                "text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400"
                            )}
                            whileHover={{ x: 3 }}
                        >
                            Ver compatibilidade <ExternalLink size={14} />
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
