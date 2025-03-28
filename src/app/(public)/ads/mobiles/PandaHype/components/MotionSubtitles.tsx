'use client';

import { cn } from '@utils/utils';
import { motion, useAnimation } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export default function MotionSubtitles() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const controls = useAnimation();

    const words = [
        { id: 1, text: "felicidade", translation: "happiness", color: "text-emerald-400" },
        { id: 2, text: "aventura", translation: "adventure", color: "text-cyan-400" },
        { id: 3, text: "amizade", translation: "friendship", color: "text-indigo-400" },
        { id: 4, text: "coragem", translation: "courage", color: "text-amber-400" },
        { id: 5, text: "liberdade", translation: "freedom", color: "text-rose-400" },
    ];

    useEffect(() => {
        const sequence = async () => {
            await controls.start("visible");
            await controls.start("highlight");
            await new Promise(resolve => setTimeout(resolve, 1500));
            await controls.start("end");

            // Wait and restart the animation
            setTimeout(() => {
                controls.start("hidden").then(() => {
                    sequence();
                });
            }, 1000);
        };

        sequence();
    }, [controls]);

    return (
        <section className="py-10">
            <div className="flex flex-col items-center">
                {/* Section Title */}
                <div className="flex items-center gap-2 mb-6">
                    <Lightbulb className="w-6 h-6 text-amber-400" />
                    <h2 className="text-2xl font-bold">Legendas Inteligentes</h2>
                </div>

                {/* Display mockup */}
                <motion.div
                    className={cn(
                        "relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border",
                        isDark
                            ? "border-gray-800 bg-gray-900/60 backdrop-blur-xl"
                            : "border-gray-200 bg-white/80 backdrop-blur-xl"
                    )}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                >
                    {/* Video container */}
                    <div className="aspect-video bg-black/90 relative">
                        <div className="absolute inset-0 flex items-center justify-center text-white/30">
                            <span className="text-sm">Preview do vídeo</span>
                        </div>
                    </div>

                    {/* Subtitle region */}
                    <div className="p-4 flex flex-col items-center space-y-4">
                        <motion.div
                            className="flex flex-wrap justify-center gap-x-2 min-h-[80px] items-center"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
                                highlight: { transition: { staggerChildren: 0.1 } },
                                end: { opacity: 0, transition: { delay: 0.5, duration: 0.5 } }
                            }}
                            initial="hidden"
                            animate={controls}
                        >
                            {["A", "jornada", "para", "encontrar", "a"].map((word, i) => (
                                <motion.span
                                    key={i}
                                    className="inline-block"
                                    variants={{
                                        hidden: { opacity: 0, y: 10 },
                                        visible: { opacity: 1, y: 0 },
                                        highlight: {},
                                        end: {}
                                    }}
                                >
                                    {word}{' '}
                                </motion.span>
                            ))}
                            {words.map((word, index) => (
                                <motion.div
                                    key={word.id}
                                    className={cn("relative inline-block", index === 0 ? "" : "hidden")}
                                    variants={{
                                        hidden: { opacity: 0, y: 10, display: "none" },
                                        visible: {
                                            opacity: 1,
                                            y: 0,
                                            display: "inline-block",
                                            transition: { delay: 0.5 }
                                        },
                                        highlight: {
                                            scale: [1, 1.15, 1],
                                            transition: {
                                                times: [0, 0.5, 1],
                                                duration: 1.5
                                            }
                                        },
                                        end: {}
                                    }}
                                >
                                    <span className={cn("font-bold", word.color)}>{word.text}</span>
                                    <motion.div
                                        className={cn(
                                            "absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs whitespace-nowrap",
                                            isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800 shadow-md"
                                        )}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{
                                            opacity: [0, 1, 1, 0],
                                            y: [5, 0, 0, -5]
                                        }}
                                        transition={{
                                            times: [0, 0.1, 0.9, 1],
                                            duration: 1.5,
                                            delay: 0.7
                                        }}
                                    >
                                        {word.translation}
                                    </motion.div>
                                </motion.div>
                            ))}
                            {["começa", "agora."].map((word, i) => (
                                <motion.span
                                    key={`end-${i}`}
                                    className="inline-block"
                                    variants={{
                                        hidden: { opacity: 0, y: 10 },
                                        visible: { opacity: 1, y: 0 },
                                        highlight: {},
                                        end: {}
                                    }}
                                >
                                    {word}{' '}
                                </motion.span>
                            ))}
                        </motion.div>

                        <div className="w-full pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                                <span>Palavras aprendidas: 28/46</span>
                                <span>00:45 / 01:24</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.p
                    className="text-center mt-6 text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
                    Descubra palavras-chave enquanto assiste. Aprenda seu significado em contexto natural!
                </motion.p>
            </div>
        </section>
    );
}
