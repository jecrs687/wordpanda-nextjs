'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Download, Globe, SmartphoneIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DownloadApp() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = theme === 'dark';

    return (
        <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className={cn(
                    "absolute bottom-0 left-0 w-full h-1/2 -z-10",
                    isDark
                        ? "bg-gradient-to-b from-transparent to-gray-950/50"
                        : "bg-gradient-to-b from-transparent to-cyan-50/30"
                )} />

                <div className={cn(
                    "absolute top-0 right-0 w-1/2 h-1/2 rounded-full blur-3xl opacity-20 -z-10",
                    isDark ? "bg-cyan-900" : "bg-cyan-100"
                )} />

                <div className={cn(
                    "absolute bottom-0 left-0 w-1/2 h-1/2 rounded-full blur-3xl opacity-20 -z-10",
                    isDark ? "bg-purple-900" : "bg-purple-100"
                )} />
            </div>

            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    <div className={cn(
                        "rounded-3xl overflow-hidden border relative z-10",
                        isDark ? "bg-gray-900/70 backdrop-blur-sm border-gray-800" : "bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl"
                    )}>
                        <div className={cn(
                            "h-2 w-full",
                            "bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500"
                        )} />

                        <div className="p-8 md:p-12">
                            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                                {/* Content */}
                                <div className="lg:w-3/5">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        viewport={{ once: true }}
                                        className={cn(
                                            "inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-sm font-medium mb-6",
                                            isDark
                                                ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                                : "bg-purple-50 text-purple-700 border border-purple-100"
                                        )}
                                    >
                                        <Download className="w-4 h-4" />
                                        <span>Disponível para todos os dispositivos</span>
                                    </motion.div>

                                    <motion.h2
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.1 }}
                                        viewport={{ once: true }}
                                        className="text-3xl md:text-4xl font-bold mb-4"
                                    >
                                        Comece a{' '}
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-purple-500">
                                            viralizar
                                        </span>{' '}
                                        no aprendizado hoje mesmo
                                    </motion.h2>

                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        viewport={{ once: true }}
                                        className={cn(
                                            "text-lg mb-8",
                                            isDark ? "text-zinc-300" : "text-zinc-700"
                                        )}
                                    >
                                        Junte-se à comunidade viral do WordPanda e transforme seu aprendizado de idiomas em uma experiência divertida, competitiva e altamente eficiente.
                                    </motion.p>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.3 }}
                                        viewport={{ once: true }}
                                        className="space-y-4 mb-8"
                                    >
                                        {[
                                            "Acesso a todos os recursos virais e desafios diários",
                                            "Comunidade global de estudantes para competir e colaborar",
                                            "Inteligência artificial que se adapta ao seu estilo de aprendizado",
                                            "Conteúdo atualizado diariamente com tendências globais"
                                        ].map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                                                    isDark ? "bg-cyan-900/50 text-cyan-400" : "bg-cyan-100 text-cyan-700"
                                                )}>
                                                    <Check className="w-3 h-3" />
                                                </div>
                                                <span className={cn(
                                                    "text-sm",
                                                    isDark ? "text-gray-300" : "text-gray-700"
                                                )}>
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.4 }}
                                        viewport={{ once: true }}
                                        className="flex flex-wrap gap-4"
                                    >
                                        <Link href="/register">
                                            <motion.button
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                className={cn(
                                                    "px-6 py-3 rounded-xl font-medium text-white",
                                                    "bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600",
                                                    "shadow-lg shadow-cyan-500/20 dark:shadow-cyan-900/20",
                                                    "transition-all duration-300 flex items-center gap-2"
                                                )}
                                            >
                                                Comece gratuitamente
                                                <ArrowRight className="w-5 h-5" />
                                            </motion.button>
                                        </Link>

                                        <div className="flex items-center gap-3">
                                            <Link href="#mobile-app">
                                                <button className={cn(
                                                    "p-3 rounded-xl",
                                                    isDark
                                                        ? "bg-gray-800 text-white hover:bg-gray-700"
                                                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                                                )}>
                                                    <SmartphoneIcon className="w-5 h-5" />
                                                </button>
                                            </Link>

                                            <Link href="#web-app">
                                                <button className={cn(
                                                    "p-3 rounded-xl",
                                                    isDark
                                                        ? "bg-gray-800 text-white hover:bg-gray-700"
                                                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                                                )}>
                                                    <Globe className="w-5 h-5" />
                                                </button>
                                            </Link>

                                            <span className={cn(
                                                "text-sm",
                                                isDark ? "text-gray-400" : "text-gray-600"
                                            )}>
                                                Disponível para Web & Mobile
                                            </span>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Phone Preview */}
                                <div className="lg:w-2/5">
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.7, delay: 0.2 }}
                                        viewport={{ once: true }}
                                        className="relative"
                                    >
                                        <div className={cn(
                                            "absolute -inset-4 rounded-3xl blur-lg opacity-30",
                                            isDark
                                                ? "bg-gradient-to-br from-cyan-600/30 to-purple-600/30"
                                                : "bg-gradient-to-br from-cyan-500/20 to-purple-500/20"
                                        )} />

                                        <div className={cn(
                                            "relative w-[280px] h-[580px] mx-auto rounded-[3rem] border-[14px] overflow-hidden",
                                            isDark ? "border-gray-800 bg-gray-950" : "border-gray-200 bg-white"
                                        )}>
                                            {/* Notch */}
                                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/2 h-7 bg-black rounded-b-3xl z-10" />

                                            {/* Screen content */}
                                            <div className="relative h-full overflow-hidden">
                                                {/* Header */}
                                                <div className={cn(
                                                    "w-full h-14 flex items-center justify-between px-4",
                                                    isDark ? "bg-gray-900" : "bg-white"
                                                )}>
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                                        WP
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <div className="h-4 w-4 rounded-full bg-amber-500" />
                                                        <div className={cn(
                                                            "text-xs px-2 py-1 rounded-full",
                                                            isDark ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
                                                        )}>
                                                            🔥 7
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Viral Challenge */}
                                                <div className="p-4">
                                                    <div className={cn(
                                                        "p-4 rounded-2xl mb-4",
                                                        isDark
                                                            ? "bg-gradient-to-br from-gray-800 to-gray-900"
                                                            : "bg-gradient-to-br from-gray-50 to-gray-100"
                                                    )}>
                                                        <div className="flex justify-between items-center mb-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className={cn(
                                                                    "w-10 h-10 rounded-xl flex items-center justify-center text-xl",
                                                                    isDark ? "bg-gray-700" : "bg-white"
                                                                )}>
                                                                    🚀
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-bold text-sm">Desafio Viral da Semana</h3>
                                                                    <p className={cn(
                                                                        "text-xs",
                                                                        isDark ? "text-gray-400" : "text-gray-600"
                                                                    )}>
                                                                        +4.239 participantes
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className={cn(
                                                                "px-2 py-1 rounded-lg text-xs",
                                                                isDark
                                                                    ? "bg-purple-900/40 text-purple-400"
                                                                    : "bg-purple-100 text-purple-700"
                                                            )}>
                                                                NOVO
                                                            </div>
                                                        </div>

                                                        <div className={cn(
                                                            "w-full h-[140px] rounded-xl mb-3 flex items-center justify-center",
                                                            isDark ? "bg-gray-950" : "bg-white"
                                                        )}>
                                                            <span className="text-5xl">🎮</span>
                                                        </div>

                                                        <div className="flex justify-between items-center">
                                                            <div className="text-xs font-medium">Seu progresso</div>
                                                            <div className="text-xs font-bold">42%</div>
                                                        </div>
                                                        <div className="mt-2 h-1.5 w-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                                                            <motion.div
                                                                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                                                                initial={{ width: 0 }}
                                                                animate={{ width: "42%" }}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Trending Words */}
                                                    <div className={cn(
                                                        "rounded-2xl overflow-hidden",
                                                        isDark
                                                            ? "bg-gray-800/80 border border-gray-700"
                                                            : "bg-white border border-gray-200"
                                                    )}>
                                                        <div className={cn(
                                                            "p-3 flex justify-between items-center",
                                                            isDark ? "bg-gray-900/50" : "bg-gray-50"
                                                        )}>
                                                            <h4 className="font-bold text-sm">Palavras em Alta</h4>
                                                            <div className={cn(
                                                                "px-2 py-1 rounded-full text-xs",
                                                                isDark
                                                                    ? "bg-gray-800 text-gray-300"
                                                                    : "bg-gray-100 text-gray-700"
                                                            )}>
                                                                Ver todas
                                                            </div>
                                                        </div>

                                                        <div className="p-3 space-y-3">
                                                            {[
                                                                { word: "FOMO", translation: "Fear of missing out", flag: "🇺🇸" },
                                                                { word: "Chido", translation: "Legal/bacana", flag: "🇲🇽" },
                                                                { word: "Guay", translation: "Legal/descolado", flag: "🇪🇸" }
                                                            ].map((item, idx) => (
                                                                <div key={idx} className="flex justify-between items-center">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-lg">{item.flag}</span>
                                                                        <div>
                                                                            <div className="font-bold text-sm">{item.word}</div>
                                                                            <div className="text-xs text-gray-500 dark:text-gray-400">{item.translation}</div>
                                                                        </div>
                                                                    </div>
                                                                    <div className={cn(
                                                                        "px-2 py-1 rounded-lg text-xs font-bold",
                                                                        isDark
                                                                            ? "bg-cyan-900/30 text-cyan-400"
                                                                            : "bg-cyan-100 text-cyan-700"
                                                                    )}>
                                                                        +{Math.floor(Math.random() * 200) + 20}%
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Bottom Nav */}
                                                <div className={cn(
                                                    "absolute bottom-0 left-0 right-0 h-16 border-t flex items-center justify-around px-6",
                                                    isDark
                                                        ? "bg-gray-900 border-gray-800"
                                                        : "bg-white border-gray-200"
                                                )}>
                                                    {['🏠', '🔍', '🏆', '👤'].map((icon, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={cn(
                                                                "w-10 h-10 rounded-full flex items-center justify-center text-lg",
                                                                idx === 0 && (isDark ? "bg-gray-800" : "bg-gray-100")
                                                            )}
                                                        >
                                                            {icon}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Animated bubbles */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, x: -30 }}
                                            animate={{ opacity: 1, y: 0, x: -40 }}
                                            transition={{
                                                y: { duration: 2, repeat: Infinity, repeatType: 'reverse' },
                                                opacity: { duration: 0.3 }
                                            }}
                                            className="absolute top-10 -left-4"
                                        >
                                            <div className={cn(
                                                "px-3 py-1.5 rounded-full text-xs font-medium",
                                                isDark
                                                    ? "bg-purple-900/50 text-purple-300 border border-purple-800/50"
                                                    : "bg-purple-100 text-purple-700 border border-purple-200"
                                            )}>
                                                +50 pontos!
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 0, x: 30 }}
                                            animate={{ opacity: 1, y: 0, x: 40 }}
                                            transition={{
                                                y: { duration: 3, repeat: Infinity, repeatType: 'reverse', delay: 1 },
                                                opacity: { duration: 0.3, delay: 0.5 }
                                            }}
                                            className="absolute bottom-32 -right-4"
                                        >
                                            <div className={cn(
                                                "px-3 py-1.5 rounded-full text-xs font-medium",
                                                isDark
                                                    ? "bg-cyan-900/50 text-cyan-300 border border-cyan-800/50"
                                                    : "bg-cyan-100 text-cyan-700 border border-cyan-200"
                                            )}>
                                                🔥 Streak: 7 dias
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Social proof */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                viewport={{ once: true }}
                                className="mt-12 flex flex-col items-center text-center"
                            >
                                <div className="flex -space-x-2 mb-3">
                                    {['bg-cyan-500', 'bg-purple-500', 'bg-amber-500', 'bg-emerald-500', 'bg-pink-500'].map((color, i) => (
                                        <div
                                            key={i}
                                            className={cn(
                                                `w-8 h-8 rounded-full ${color} flex items-center justify-center text-white text-xs border-2`,
                                                isDark ? "border-gray-900" : "border-white"
                                            )}
                                        >
                                            {String.fromCharCode(65 + i)}
                                        </div>
                                    ))}
                                </div>
                                <p className={cn(
                                    "text-sm",
                                    isDark ? "text-gray-400" : "text-gray-600"
                                )}>
                                    Junte-se a mais de <span className="font-bold">100.000</span> estudantes que já estão viralizando no aprendizado
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
