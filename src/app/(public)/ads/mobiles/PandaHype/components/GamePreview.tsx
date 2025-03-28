'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { BookOpen, Brain, FileQuestion, Gamepad2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';

export default function GamePreview() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [activeGame, setActiveGame] = useState(0);

    const games = [
        {
            id: 0,
            title: "Quiz",
            icon: <FileQuestion className="h-5 w-5" />,
            color: "emerald",
            description: "Teste seu conhecimento com perguntas sobre palavras que você aprendeu.",
            buttonText: "Jogar Quiz"
        },
        {
            id: 1,
            title: "Flashcards",
            icon: <BookOpen className="h-5 w-5" />,
            color: "blue",
            description: "Pratique sua memória com cartões de palavras e definições.",
            buttonText: "Praticar com Flashcards"
        },
        {
            id: 2,
            title: "Word Pairs",
            icon: <Brain className="h-5 w-5" />,
            color: "purple",
            description: "Combine palavras com seus significados neste jogo de memória.",
            buttonText: "Jogar Word Pairs"
        }
    ];

    const getColorClasses = (color: string, active: boolean) => {
        if (!active) return "";

        const colorMap: Record<string, string> = {
            emerald: "text-emerald-500 border-emerald-500",
            blue: "text-blue-500 border-blue-500",
            purple: "text-purple-500 border-purple-500"
        };

        return colorMap[color] || "";
    };

    const getButtonClasses = (color: string) => {
        const colorMap: Record<string, string> = {
            emerald: "bg-emerald-500 hover:bg-emerald-600",
            blue: "bg-blue-500 hover:bg-blue-600",
            purple: "bg-purple-500 hover:bg-purple-600"
        };

        return colorMap[color] || "";
    };

    return (
        <section className="py-10">
            <div className="flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-500"
                >
                    <Gamepad2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Jogos Divertidos</span>
                </motion.div>

                <motion.h2
                    className="text-3xl font-bold mb-4 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Aprenda Jogando
                </motion.h2>

                <motion.p
                    className="text-center mb-8 text-zinc-600 dark:text-zinc-400 max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    Reforce o vocabulário com jogos divertidos que tornam a prática regular um prazer.
                </motion.p>

                <motion.div
                    className={cn(
                        "w-full max-w-md rounded-2xl border",
                        isDark
                            ? "bg-gray-900/60 border-gray-800 backdrop-blur-xl"
                            : "bg-white/80 border-gray-200 backdrop-blur-xl"
                    )}
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex border-b border-gray-200 dark:border-gray-800">
                        {games.map((game) => (
                            <button
                                key={game.id}
                                className={cn(
                                    "flex-1 py-4 px-2 text-center text-sm font-medium border-b-2 transition-colors",
                                    game.id === activeGame
                                        ? getColorClasses(game.color, true)
                                        : "border-transparent hover:text-gray-700 dark:hover:text-gray-300"
                                )}
                                onClick={() => setActiveGame(game.id)}
                            >
                                <div className="flex flex-col items-center gap-1">
                                    {game.icon}
                                    <span>{game.title}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        <AnimatedGamePreview game={games[activeGame]} isDark={isDark} getButtonClasses={getButtonClasses} />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function AnimatedGamePreview({ game, isDark, getButtonClasses }: { game: any, isDark: boolean, getButtonClasses: (color: string) => string }) {
    return (
        <motion.div
            key={game.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
        >
            {game.id === 0 && (
                // Quiz game preview
                <div className="w-full space-y-4 mb-6">
                    <div className={cn(
                        "p-4 rounded-lg",
                        isDark ? "bg-gray-800" : "bg-gray-100"
                    )}>
                        <p className="font-medium mb-3">Qual o significado de "adventure"?</p>
                        <div className="space-y-2">
                            {["Aventura", "Admiração", "Adivinhação", "Advertência"].map((option, i) => (
                                <motion.div
                                    key={i}
                                    className={cn(
                                        "p-2 rounded border text-sm cursor-pointer",
                                        i === 0
                                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-400"
                                            : isDark
                                                ? "border-gray-700 hover:border-gray-600"
                                                : "border-gray-300 hover:border-gray-400"
                                    )}
                                    whileHover={{ x: 5 }}
                                >
                                    {option}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {game.id === 1 && (
                // Flashcard preview
                <div className="w-full mb-6">
                    <div className="relative h-44 w-full perspective">
                        <motion.div
                            className="absolute inset-0"
                            animate={{ rotateY: [0, 180, 0] }}
                            transition={{ duration: 4, repeat: Infinity, repeatDelay: 1 }}
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            <div className={cn(
                                "absolute inset-0 flex items-center justify-center rounded-xl p-6",
                                "backface-hidden",
                                isDark
                                    ? "bg-gray-800 text-white"
                                    : "bg-blue-50 text-blue-800"
                            )}>
                                <span className="text-2xl font-bold">Adventure</span>
                            </div>
                            <div className={cn(
                                "absolute inset-0 flex items-center justify-center rounded-xl p-6 [transform:rotateY(180deg)]",
                                "backface-hidden",
                                isDark
                                    ? "bg-blue-800 text-white"
                                    : "bg-blue-100 text-blue-800"
                            )}>
                                <span className="text-2xl font-bold">Aventura</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}

            {game.id === 2 && (
                // Word Pairs preview
                <div className="w-full grid grid-cols-2 gap-2 mb-6">
                    {[
                        { id: 1, text: "Adventure", matched: true },
                        { id: 2, text: "Aventura", matched: true },
                        { id: 3, text: "Friend", matched: false },
                        { id: 4, text: "Amigo", matched: false }
                    ].map((card) => (
                        <motion.div
                            key={card.id}
                            className={cn(
                                "aspect-[3/4] rounded-lg flex items-center justify-center cursor-pointer",
                                "text-center p-2 text-sm font-medium",
                                card.matched
                                    ? isDark
                                        ? "bg-purple-700/40 border-2 border-purple-600 text-white"
                                        : "bg-purple-100 border-2 border-purple-500 text-purple-800"
                                    : isDark
                                        ? "bg-gray-800 hover:bg-gray-700"
                                        : "bg-gray-100 hover:bg-gray-200"
                            )}
                            whileHover={{ scale: 1.05 }}
                        >
                            {card.text}
                        </motion.div>
                    ))}
                </div>
            )}

            <p className="text-sm text-center text-zinc-600 dark:text-zinc-400 mb-4">
                {game.description}
            </p>

            <motion.button
                className={cn(
                    "w-full py-2.5 px-4 rounded-lg text-white font-medium",
                    getButtonClasses(game.color)
                )}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
            >
                {game.buttonText}
            </motion.button>
        </motion.div>
    );
}
