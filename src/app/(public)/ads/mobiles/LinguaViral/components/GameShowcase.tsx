'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { Flame, Star, Timer, Trophy, Zap } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function GameShowcase() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [activeGame, setActiveGame] = useState(0);
    const [points, setPoints] = useState(0);

    // Move games declaration before useEffect to fix "Cannot access 'games' before initialization" error
    const games = [
        {
            name: "Word Race",
            description: "Combine o máximo de palavras possível antes que o tempo acabe!",
            color: "cyan",
            icon: <Timer className="w-6 h-6" />,
            points: 250,
            time: "60s",
            gradient: "from-cyan-500 to-blue-500"
        },
        {
            name: "Viral Vocabulário",
            description: "Aprenda as palavras mais virais em inglês neste momento!",
            color: "purple",
            icon: <Zap className="w-6 h-6" />,
            points: 300,
            time: "2min",
            gradient: "from-purple-500 to-pink-500"
        },
        {
            name: "Streak Challenge",
            description: "Mantenha sua sequência diária e multiplique seus pontos!",
            color: "amber",
            icon: <Flame className="w-6 h-6" />,
            points: 500,
            time: "24h",
            gradient: "from-amber-500 to-orange-500"
        }
    ];

    useEffect(() => {
        setMounted(true);

        // Auto-increment points for demo
        const pointsInterval = setInterval(() => {
            setPoints(prev => (prev + Math.floor(Math.random() * 5) + 1) % 1000);
        }, 2000);

        // Auto-switch games for demo
        const gamesInterval = setInterval(() => {
            setActiveGame(prev => (prev + 1) % games.length);
        }, 5000);

        return () => {
            clearInterval(pointsInterval);
            clearInterval(gamesInterval);
        };
    }, []);

    if (!mounted) return null;

    const isDark = theme === 'dark';

    const getGameBg = (game, isDark) => {
        const bgs = {
            cyan: isDark ? "bg-cyan-900/30" : "bg-cyan-50",
            purple: isDark ? "bg-purple-900/30" : "bg-purple-50",
            amber: isDark ? "bg-amber-900/30" : "bg-amber-50"
        };
        return bgs[game.color];
    };

    return (
        <section className="py-16 relative overflow-hidden" id="games">
            <div className="absolute inset-0 pointer-events-none">
                <div className={cn(
                    "absolute bottom-0 left-0 w-1/2 h-1/2 rounded-full blur-3xl opacity-20 -z-10",
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
                                ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                                : "bg-orange-50 text-orange-700 border border-orange-100"
                        )}
                    >
                        Jogos Virais
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold mb-4"
                    >
                        Aprenda jogando e{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-500">
                            ganhe pontos
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className={cn(
                            "max-w-2xl mx-auto text-lg mb-10",
                            isDark ? "text-zinc-300" : "text-zinc-700"
                        )}
                    >
                        Jogos rápidos e divertidos que você pode jogar em qualquer lugar, fazendo o aprendizado se tornar um vício positivo
                    </motion.p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                    {/* Game Showcase */}
                    <div className="lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className={cn(
                                "absolute inset-0 rounded-3xl blur-lg",
                                `bg-gradient-to-r ${games[activeGame].gradient} opacity-20`
                            )} />

                            <div className={cn(
                                "relative p-6 rounded-2xl border backdrop-blur-sm overflow-hidden",
                                isDark
                                    ? "bg-gray-900/80 border-gray-800"
                                    : "bg-white border-gray-200 shadow-lg"
                            )}>
                                {/* Points counter */}
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex items-center gap-2">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center",
                                            isDark ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-600"
                                        )}>
                                            <Trophy className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Seus pontos</div>
                                            <div className="font-bold text-2xl tabular-nums">{points}</div>
                                        </div>
                                    </div>

                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ scale: [1, i === 0 ? 1.2 : 1, 1] }}
                                                transition={{
                                                    duration: 0.5,
                                                    repeat: Infinity,
                                                    repeatType: "loop",
                                                    delay: i * 0.2,
                                                    repeatDelay: 2
                                                }}
                                                className={cn(
                                                    "w-6 h-6 text-amber-500 -ml-1",
                                                    i > 2 && (isDark ? "text-gray-700" : "text-gray-300")
                                                )}
                                            >
                                                <Star className="w-6 h-6 fill-current" />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Game display */}
                                <div className={cn(
                                    "p-6 rounded-xl mb-6 relative overflow-hidden",
                                    getGameBg(games[activeGame], isDark)
                                )}>
                                    {/* Background pattern - animated dots */}
                                    <div className="absolute inset-0 opacity-10">
                                        {[...Array(20)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="absolute w-1 h-1 rounded-full bg-current"
                                                initial={{
                                                    x: Math.random() * 100 + "%",
                                                    y: Math.random() * 100 + "%"
                                                }}
                                                animate={{
                                                    x: [null, Math.random() * 100 + "%"],
                                                    y: [null, Math.random() * 100 + "%"]
                                                }}
                                                transition={{
                                                    duration: Math.random() * 10 + 10,
                                                    repeat: Infinity,
                                                    repeatType: "mirror"
                                                }}
                                            />
                                        ))}
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-xl flex items-center justify-center",
                                                    isDark
                                                        ? `bg-${games[activeGame].color}-500/30 text-${games[activeGame].color}-400`
                                                        : `bg-${games[activeGame].color}-200/70 text-${games[activeGame].color}-700`
                                                )}>
                                                    {games[activeGame].icon}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg">{games[activeGame].name}</h3>
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <span className={cn(
                                                            isDark ? "text-gray-400" : "text-gray-500"
                                                        )}>
                                                            {games[activeGame].time}
                                                        </span>
                                                        <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
                                                        <span className={cn(
                                                            isDark ? "text-amber-400" : "text-amber-600"
                                                        )}>
                                                            +{games[activeGame].points} pontos
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button className={cn(
                                                "text-xs font-medium px-3 py-1.5 rounded-full",
                                                isDark
                                                    ? "bg-gray-800 text-white"
                                                    : "bg-white text-gray-900"
                                            )}>
                                                Jogar
                                            </button>
                                        </div>

                                        <p className={cn(
                                            "text-sm mb-6",
                                            isDark ? "text-gray-300" : "text-gray-700"
                                        )}>
                                            {games[activeGame].description}
                                        </p>

                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "text-xs px-3 py-1 rounded-full",
                                                isDark
                                                    ? "bg-gray-800 text-gray-300"
                                                    : "bg-white text-gray-700"
                                            )}>
                                                #trending
                                            </div>
                                            <div className={cn(
                                                "text-xs px-3 py-1 rounded-full",
                                                isDark
                                                    ? "bg-gray-800 text-gray-300"
                                                    : "bg-white text-gray-700"
                                            )}>
                                                #viral
                                            </div>
                                            <div className={cn(
                                                "text-xs px-3 py-1 rounded-full",
                                                isDark
                                                    ? "bg-gray-800 text-gray-300"
                                                    : "bg-white text-gray-700"
                                            )}>
                                                #{games[activeGame].name.toLowerCase().replace(/\s+/g, '')}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Game selector */}
                                <div className="flex gap-2 justify-center">
                                    {games.map((game, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveGame(index)}
                                            className={cn(
                                                "w-2 h-2 rounded-full transition-all",
                                                activeGame === index
                                                    ? `w-8 bg-${game.color}-500`
                                                    : (isDark ? "bg-gray-700" : "bg-gray-300")
                                            )}
                                            aria-label={`Select ${game.name}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Points & Rewards */}
                    <div className="lg:w-1/2">
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                className={cn(
                                    "p-6 rounded-xl border",
                                    isDark
                                        ? "bg-gray-900/50 border-gray-800"
                                        : "bg-white border-gray-100 shadow-sm"
                                )}
                            >
                                <h3 className="text-xl font-bold mb-4">
                                    Transforme pontos em recompensas reais
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        {
                                            reward: "Acesso Premium por 1 semana",
                                            points: 500,
                                            icon: "🌟",
                                            progress: 75,
                                            color: "from-amber-500 to-yellow-500"
                                        },
                                        {
                                            reward: "Tema exclusivo WordPanda",
                                            points: 1000,
                                            icon: "🎨",
                                            progress: 40,
                                            color: "from-cyan-500 to-blue-500"
                                        },
                                        {
                                            reward: "Certificado de Fluência Digital",
                                            points: 5000,
                                            icon: "🏆",
                                            progress: 12,
                                            color: "from-purple-500 to-pink-500"
                                        }
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-xl",
                                                isDark ? "bg-gray-800" : "bg-gray-100"
                                            )}>
                                                {item.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h4 className="font-medium text-sm truncate pr-2">
                                                        {item.reward}
                                                    </h4>
                                                    <div className={cn(
                                                        "text-xs font-semibold tabular-nums",
                                                        isDark ? "text-gray-400" : "text-gray-600"
                                                    )}>
                                                        {points}/{item.points}
                                                    </div>
                                                </div>
                                                <div className="h-1.5 w-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                                                    <motion.div
                                                        className={cn(
                                                            "h-full rounded-full bg-gradient-to-r",
                                                            item.color
                                                        )}
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${item.progress}%` }}
                                                        transition={{ duration: 1, delay: index * 0.2 }}
                                                        viewport={{ once: true }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                viewport={{ once: true }}
                                className={cn(
                                    "p-4 rounded-xl",
                                    isDark
                                        ? "bg-amber-900/20 border border-amber-800/20"
                                        : "bg-amber-50 border border-amber-100"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-amber-500 text-white text-xl">
                                        🔥
                                    </div>
                                    <div>
                                        <h4 className={cn(
                                            "font-semibold",
                                            isDark ? "text-amber-400" : "text-amber-700"
                                        )}>
                                            Streak atual: 7 dias
                                        </h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Continue jogando diariamente para multiplicar seus pontos em 2x!
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
