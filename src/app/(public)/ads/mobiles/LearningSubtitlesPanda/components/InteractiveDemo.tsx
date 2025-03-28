'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function InteractiveDemo() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [viewMode, setViewMode] = useState('subtitles');

    // Demo subtitle with special words
    const subtitleText = "Eu não sei o que fazer com a minha vida. Talvez eu devesse viajar para outro país.";
    const highlightedWords = [
        { word: "sei", translation: "know", index: 9 },
        { word: "vida", translation: "life", index: 36 },
        { word: "viajar", translation: "travel", index: 61 },
        { word: "país", translation: "country", index: 74 }
    ];

    useEffect(() => {
        setMounted(true);

        // Auto-rotate steps for demo
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % 4);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    if (!mounted) return null;

    const isDark = theme === 'dark';

    // Render highlighted text with clickable words
    const renderHighlightedText = () => {
        let lastIndex = 0;
        const elements = [];

        highlightedWords.forEach((highlight, idx) => {
            // Text before the highlighted word
            if (highlight.index > lastIndex) {
                elements.push(
                    <span key={`text-${idx}`} className="text-gray-800 dark:text-gray-300">
                        {subtitleText.substring(lastIndex, highlight.index)}
                    </span>
                );
            }

            // The highlighted word
            elements.push(
                <motion.span
                    key={`highlight-${idx}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                        "inline-block cursor-pointer font-semibold mx-0.5 px-1 rounded",
                        isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-700"
                    )}
                >
                    {subtitleText.substr(highlight.index, highlight.word.length)}
                </motion.span>
            );

            lastIndex = highlight.index + highlight.word.length;
        });

        // Remaining text after last highlight
        if (lastIndex < subtitleText.length) {
            elements.push(
                <span key="text-end" className="text-gray-800 dark:text-gray-300">
                    {subtitleText.substring(lastIndex)}
                </span>
            );
        }

        return elements;
    };

    const steps = [
        {
            title: "Passo 1: Assista com Legendas Interativas",
            description: "Palavras importantes são destacadas automaticamente enquanto você assiste."
        },
        {
            title: "Passo 2: Toque nas Palavras para Aprender",
            description: "Ao tocar em uma palavra, você vê tradução, pronúncia e exemplos contextuais."
        },
        {
            title: "Passo 3: Pratique com Exercícios",
            description: "Exercícios personalizados ajudam a memorizar as palavras que você descobriu."
        },
        {
            title: "Passo 4: Acompanhe seu Progresso",
            description: "Veja seu vocabulário crescendo e receba recomendações personalizadas."
        }
    ];

    return (
        <section className="py-16 relative overflow-hidden" id="demo">
            <div className="absolute inset-0 pointer-events-none">
                <div className={cn(
                    "absolute top-0 left-0 w-1/2 h-1/2 rounded-full blur-3xl opacity-20 -z-10",
                    isDark ? "bg-cyan-900" : "bg-cyan-100"
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
                            "inline-block px-4 py-1 rounded-full text-sm font-medium mb-4",
                            isDark
                                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                                : "bg-cyan-50 text-cyan-700 border border-cyan-100"
                        )}
                    >
                        Veja em ação
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold mb-4"
                    >
                        Como o{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-500">
                            WordPanda
                        </span>{' '}
                        Funciona
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className={cn(
                            "max-w-2xl mx-auto text-lg mb-8",
                            isDark ? "text-zinc-300" : "text-zinc-700"
                        )}
                    >
                        Uma experiência de aprendizado totalmente integrada à sua rotina de entretenimento
                    </motion.p>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                    {/* Phone Demo */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2 flex justify-center"
                    >
                        <div className={cn(
                            "relative w-72 max-w-full rounded-[2.5rem] border-8 p-1",
                            isDark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"
                        )}>
                            {/* Phone notch */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-gray-900 dark:bg-black rounded-b-xl z-10" />

                            {/* Screen content */}
                            <div className="relative rounded-2xl overflow-hidden h-[600px]">
                                <div className={cn(
                                    "absolute inset-0",
                                    isDark ? "bg-gray-950" : "bg-gray-100"
                                )}>
                                    {/* Video player mock */}
                                    <div className="h-1/3 relative">
                                        <div className={cn(
                                            "absolute inset-0 flex items-center justify-center",
                                            isDark ? "bg-gray-800" : "bg-gray-700"
                                        )}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-30 text-white">
                                                <polygon points="5 3 19 12 5 21 5 3" />
                                            </svg>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                                            <motion.div
                                                className="h-full bg-emerald-500"
                                                animate={{ width: ['0%', '100%'] }}
                                                transition={{ duration: 20, repeat: Infinity }}
                                            />
                                        </div>
                                    </div>

                                    {/* Subtitle panel */}
                                    <div className={cn(
                                        "absolute bottom-0 left-0 right-0 p-4",
                                        isDark ? "bg-gray-900" : "bg-white"
                                    )}>
                                        {/* View mode toggle */}
                                        <div className="flex mb-4 border rounded-lg overflow-hidden">
                                            <button
                                                className={cn(
                                                    "flex-1 py-2 text-xs font-medium transition-colors",
                                                    viewMode === 'subtitles'
                                                        ? (isDark ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900")
                                                        : (isDark ? "bg-transparent text-gray-400" : "bg-transparent text-gray-500")
                                                )}
                                                onClick={() => setViewMode('subtitles')}
                                            >
                                                Legendas
                                            </button>
                                            <button
                                                className={cn(
                                                    "flex-1 py-2 text-xs font-medium transition-colors",
                                                    viewMode === 'wordlist'
                                                        ? (isDark ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900")
                                                        : (isDark ? "bg-transparent text-gray-400" : "bg-transparent text-gray-500")
                                                )}
                                                onClick={() => setViewMode('wordlist')}
                                            >
                                                Palavras
                                            </button>
                                        </div>

                                        {viewMode === 'subtitles' ? (
                                            <div className="p-3 rounded-lg mb-3 text-base leading-relaxed">
                                                {renderHighlightedText()}
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-3 mb-3">
                                                {highlightedWords.map((word, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        whileHover={{ scale: 1.03 }}
                                                        className={cn(
                                                            "p-3 rounded-lg text-sm",
                                                            isDark ? "bg-gray-800 hover:bg-gray-750" : "bg-gray-100 hover:bg-gray-200"
                                                        )}
                                                    >
                                                        <div className="font-medium mb-1">{word.word}</div>
                                                        <div className={cn(
                                                            "text-xs",
                                                            isDark ? "text-gray-400" : "text-gray-600"
                                                        )}>
                                                            {word.translation}
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Word detail panel (shows when a word is clicked) */}
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                            className={cn(
                                                "rounded-lg p-4 mb-4",
                                                isDark ? "bg-gray-800" : "bg-gray-100"
                                            )}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="text-lg font-bold">viajar</div>
                                                    <div className={cn(
                                                        "text-sm",
                                                        isDark ? "text-gray-400" : "text-gray-600"
                                                    )}>
                                                        travel (verbo)
                                                    </div>
                                                </div>
                                                <button className={cn(
                                                    "p-1.5 rounded-full",
                                                    isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
                                                )}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                                                        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"></path>
                                                        <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                                                    </svg>
                                                </button>
                                            </div>

                                            <div className={cn(
                                                "text-sm mb-3",
                                                isDark ? "text-gray-300" : "text-gray-700"
                                            )}>
                                                <strong>Exemplo:</strong> Eu quero <span className="text-emerald-500 font-medium">viajar</span> para a Espanha no próximo verão.
                                            </div>

                                            <div className="flex gap-2">
                                                <button className={cn(
                                                    "text-xs px-3 py-1.5 rounded-full",
                                                    isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-700"
                                                )}>
                                                    + Adicionar
                                                </button>
                                                <button className={cn(
                                                    "text-xs px-3 py-1.5 rounded-full",
                                                    isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
                                                )}>
                                                    Exercícios
                                                </button>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>

                            {/* Home button */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gray-400 dark:bg-gray-600 rounded-full" />
                        </div>
                    </motion.div>

                    {/* Steps */}
                    <div className="lg:w-1/2">
                        <div className="space-y-6">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className={cn(
                                        "p-6 rounded-xl border transition-all duration-300",
                                        activeStep === index
                                            ? (isDark ? "bg-gray-800/80 border-gray-700" : "bg-white border-gray-200 shadow-md")
                                            : (isDark ? "bg-gray-900/50 border-gray-800" : "bg-white/50 border-gray-200")
                                    )}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-semibold text-sm",
                                            activeStep === index
                                                ? (isDark ? "bg-cyan-500/30 text-cyan-400 border border-cyan-500/50" : "bg-cyan-100 text-cyan-700 border border-cyan-200")
                                                : (isDark ? "bg-gray-800 text-gray-400 border border-gray-700" : "bg-gray-100 text-gray-500 border border-gray-200")
                                        )}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h3 className={cn(
                                                "text-lg font-semibold mb-1",
                                                activeStep === index
                                                    ? (isDark ? "text-white" : "text-gray-900")
                                                    : (isDark ? "text-gray-300" : "text-gray-600")
                                            )}>
                                                {step.title}
                                            </h3>
                                            <p className={cn(
                                                "text-sm",
                                                activeStep === index
                                                    ? (isDark ? "text-gray-300" : "text-gray-700")
                                                    : (isDark ? "text-gray-400" : "text-gray-500")
                                            )}>
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
