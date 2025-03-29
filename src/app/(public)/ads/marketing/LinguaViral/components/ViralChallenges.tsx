'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { Calendar, Clock, Crown, Flag, Users, Zap } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ViralChallenges() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [activeChallenge, setActiveChallenge] = useState(0);

    // Move challenges declaration before useEffect to fix "Cannot access 'challenges' before initialization" error
    const challenges = [
        {
            name: "7 Dias de Fluência",
            description: "Complete exercícios diários por 7 dias consecutivos e ganhe o dobro de pontos.",
            participants: "1,458",
            timeLeft: "3 dias",
            icon: <Calendar className="w-6 h-6" />,
            color: "indigo",
            gradient: "from-indigo-500 to-blue-500"
        },
        {
            name: "Desafio #NetflixWords",
            description: "Aprenda 50 palavras das séries mais assistidas da Netflix neste mês.",
            participants: "2,874",
            timeLeft: "5 dias",
            icon: <Zap className="w-6 h-6" />,
            color: "red",
            gradient: "from-red-500 to-pink-500"
        },
        {
            name: "Competição Global",
            description: "Compita com estudantes de todo o mundo em jogos de vocabulário relâmpago.",
            participants: "12,305",
            timeLeft: "24 horas",
            icon: <Crown className="w-6 h-6" />,
            color: "amber",
            gradient: "from-amber-500 to-yellow-500"
        }
    ];

    useEffect(() => {
        setMounted(true);

        // Auto-rotate challenges for demo
        const interval = setInterval(() => {
            setActiveChallenge(prev => (prev + 1) % challenges.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    if (!mounted) return null;

    const isDark = theme === 'dark';

    const getChallengeColor = (color, isDark, type) => {
        const colorMap = {
            indigo: {
                bg: isDark ? "bg-indigo-900/30" : "bg-indigo-50",
                text: isDark ? "text-indigo-400" : "text-indigo-700",
                border: isDark ? "border-indigo-700/30" : "border-indigo-100",
                icon: isDark ? "bg-indigo-800/50 text-indigo-400" : "bg-indigo-100 text-indigo-600"
            },
            red: {
                bg: isDark ? "bg-red-900/30" : "bg-red-50",
                text: isDark ? "text-red-400" : "text-red-700",
                border: isDark ? "border-red-700/30" : "border-red-100",
                icon: isDark ? "bg-red-800/50 text-red-400" : "bg-red-100 text-red-600"
            },
            amber: {
                bg: isDark ? "bg-amber-900/30" : "bg-amber-50",
                text: isDark ? "text-amber-400" : "text-amber-700",
                border: isDark ? "border-amber-700/30" : "border-amber-100",
                icon: isDark ? "bg-amber-800/50 text-amber-400" : "bg-amber-100 text-amber-600"
            }
        };

        return colorMap[color][type];
    };

    return (
        <section className="py-16 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className={cn(
                    "absolute bottom-0 right-0 w-1/2 h-1/2 rounded-full blur-3xl opacity-20 -z-10",
                    isDark ? "bg-indigo-900" : "bg-indigo-100"
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
                            "inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-sm font-medium mb-4",
                            isDark
                                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                        )}
                    >
                        <Flag className="w-4 h-4" />
                        <span>Desafios Virais</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold mb-4"
                    >
                        Participe dos desafios e{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-500">
                            torne-se viral
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
                        Desafios temáticos semanais que mantêm sua motivação no máximo e transformam seu aprendizado em uma competição divertida
                    </motion.p>
                </div>

                <div className="flex flex-col md:flex-row gap-10 items-center">
                    {/* Challenge Showcase */}
                    <div className="lg:w-3/5">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className={cn(
                                "absolute inset-0 rounded-3xl blur-lg",
                                `bg-gradient-to-r ${challenges[activeChallenge].gradient} opacity-20`
                            )} />

                            <div className={cn(
                                "relative p-6 rounded-2xl border backdrop-blur-sm",
                                isDark
                                    ? "bg-gray-900/80 border-gray-800"
                                    : "bg-white border-gray-200 shadow-lg"
                            )}>
                                {/* Challenge Header */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex gap-4">
                                        <div className={cn(
                                            "w-14 h-14 rounded-xl flex items-center justify-center shrink-0",
                                            getChallengeColor(challenges[activeChallenge].color, isDark, 'icon')
                                        )}>
                                            {challenges[activeChallenge].icon}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">{challenges[activeChallenge].name}</h3>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-3.5 h-3.5" />
                                                    <span>{challenges[activeChallenge].participants} participantes</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    <span>Restam {challenges[activeChallenge].timeLeft}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={cn(
                                        "px-3 py-1.5 rounded-full text-xs font-medium",
                                        isDark
                                            ? "bg-emerald-900/30 text-emerald-400"
                                            : "bg-emerald-100 text-emerald-700"
                                    )}>
                                        Em andamento
                                    </div>
                                </div>

                                {/* Challenge details */}
                                <div className={cn(
                                    "p-5 rounded-xl mb-6 border",
                                    getChallengeColor(challenges[activeChallenge].color, isDark, 'bg'),
                                    getChallengeColor(challenges[activeChallenge].color, isDark, 'border')
                                )}>
                                    <p className={cn(
                                        "text-sm mb-4",
                                        getChallengeColor(challenges[activeChallenge].color, isDark, 'text')
                                    )}>
                                        {challenges[activeChallenge].description}
                                    </p>

                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { label: "Recompensa", value: "2x XP" },
                                            { label: "Dificuldade", value: "Médio" },
                                            { label: "Palavras", value: "150+" }
                                        ].map((item, idx) => (
                                            <div key={idx} className="text-center">
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                    {item.label}
                                                </div>
                                                <div className={cn(
                                                    "font-bold text-sm",
                                                    getChallengeColor(challenges[activeChallenge].color, isDark, 'text')
                                                )}>
                                                    {item.value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Progress */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-sm font-medium">Seu progresso</h4>
                                        <div className="text-sm font-semibold">
                                            42<span className="text-gray-500 dark:text-gray-400">/100</span>
                                        </div>
                                    </div>
                                    <div className="h-2.5 w-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                                        <motion.div
                                            className={cn(
                                                "h-full rounded-full bg-gradient-to-r",
                                                challenges[activeChallenge].gradient
                                            )}
                                            initial={{ width: 0 }}
                                            whileInView={{ width: "42%" }}
                                            transition={{ duration: 1 }}
                                            viewport={{ once: true }}
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-center gap-3">
                                    <button className={cn(
                                        "px-5 py-2.5 rounded-xl font-medium bg-gradient-to-r shadow-sm",
                                        challenges[activeChallenge].gradient,
                                        "text-white"
                                    )}>
                                        Iniciar Desafio
                                    </button>
                                    <button className={cn(
                                        "px-4 py-2.5 rounded-xl font-medium",
                                        isDark
                                            ? "bg-gray-800 hover:bg-gray-700 text-white"
                                            : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                                    )}>
                                        Ver detalhes
                                    </button>
                                </div>

                                {/* Navigation */}
                                <div className="mt-6 flex justify-center gap-2">
                                    {challenges.map((_, index) => (
                                        <button
                                            key={index}
                                            className={cn(
                                                "w-2 h-2 rounded-full transition-all duration-300",
                                                activeChallenge === index
                                                    ? (isDark ? "w-8 bg-white" : "w-8 bg-gray-900")
                                                    : (isDark ? "bg-gray-700" : "bg-gray-300")
                                            )}
                                            onClick={() => setActiveChallenge(index)}
                                            aria-label={`View challenge ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Challenge List */}
                    <div className="lg:w-2/5">
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                className={cn(
                                    "p-6 rounded-xl border",
                                    isDark
                                        ? "bg-gray-900/50 border-gray-800"
                                        : "bg-white border-gray-200 shadow-sm"
                                )}
                            >
                                <h3 className="text-lg font-bold mb-4">Conquistas Desbloqueadas</h3>

                                <div className="space-y-4">
                                    {[
                                        {
                                            name: "Word Master",
                                            description: "Aprenda 500 palavras em inglês",
                                            progress: 80,
                                            icon: "🏆",
                                            color: "amber"
                                        },
                                        {
                                            name: "Desafio Viral",
                                            description: "Complete 5 desafios virais",
                                            progress: 60,
                                            icon: "🔥",
                                            color: "indigo"
                                        },
                                        {
                                            name: "Compartilhador Social",
                                            description: "Compartilhe 10 conquistas",
                                            progress: 30,
                                            icon: "🌐",
                                            color: "cyan"
                                        }
                                    ].map((achievement, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0",
                                                achievement.color === "amber"
                                                    ? (isDark ? "bg-amber-900/30 text-amber-400" : "bg-amber-100 text-amber-700")
                                                    : achievement.color === "indigo"
                                                        ? (isDark ? "bg-indigo-900/30 text-indigo-400" : "bg-indigo-100 text-indigo-700")
                                                        : (isDark ? "bg-cyan-900/30 text-cyan-400" : "bg-cyan-100 text-cyan-700")
                                            )}>
                                                {achievement.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-sm mb-1">{achievement.name}</h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{achievement.description}</p>
                                                <div className="h-1.5 w-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                                                    <motion.div
                                                        className={cn(
                                                            "h-full rounded-full",
                                                            achievement.color === "amber"
                                                                ? "bg-amber-500"
                                                                : achievement.color === "indigo"
                                                                    ? "bg-indigo-500"
                                                                    : "bg-cyan-500"
                                                        )}
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${achievement.progress}%` }}
                                                        transition={{ duration: 1, delay: 0.2 * idx }}
                                                        viewport={{ once: true }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                viewport={{ once: true }}
                                className={cn(
                                    "rounded-xl overflow-hidden",
                                    isDark
                                        ? "bg-gray-900/50 border border-gray-800"
                                        : "bg-white border border-gray-200 shadow-sm"
                                )}
                            >
                                <div className={cn(
                                    "p-4 flex items-center justify-between",
                                    isDark ? "bg-gray-800" : "bg-gray-50"
                                )}>
                                    <h3 className="font-bold">Desafios em Alta</h3>
                                    <span className={cn(
                                        "text-xs px-2 py-1 rounded-full",
                                        isDark
                                            ? "bg-indigo-900/50 text-indigo-400"
                                            : "bg-indigo-100 text-indigo-600"
                                    )}>
                                        Novo
                                    </span>
                                </div>

                                <div className="p-2">
                                    {[
                                        "Desafio do Vocabulário +500",
                                        "Maratona de Phrasal Verbs",
                                        "Gírias da Internet 2023",
                                        "Expressões de Business English"
                                    ].map((challenge, idx) => (
                                        <div
                                            key={idx}
                                            className={cn(
                                                "p-3 rounded-lg flex items-center justify-between",
                                                isDark
                                                    ? "hover:bg-gray-800"
                                                    : "hover:bg-gray-50"
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="text-xl">
                                                    {idx === 0 ? "🚀" : idx === 1 ? "⚡" : idx === 2 ? "💬" : "💼"}
                                                </div>
                                                <span className="font-medium text-sm">{challenge}</span>
                                            </div>
                                            <button className={cn(
                                                "text-xs px-2 py-1 rounded-full",
                                                isDark
                                                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            )}>
                                                Ingressar
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
