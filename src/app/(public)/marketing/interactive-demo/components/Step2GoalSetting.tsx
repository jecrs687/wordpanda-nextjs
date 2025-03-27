'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useState } from 'react';

export const Step2GoalSetting = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [selectedLevel, setSelectedLevel] = useState<string | null>("beginner");
    const [selectedGoal, setSelectedGoal] = useState<string | null>("casual");
    const [selectedTime, setSelectedTime] = useState<number>(15);

    const levels = [
        { id: "beginner", name: "Iniciante", description: "Pouco ou nenhum conhecimento prévio" },
        { id: "elementary", name: "Elementar", description: "Conhecimento básico do idioma" },
        { id: "intermediate", name: "Intermediário", description: "Capaz de se comunicar em situações comuns" },
        { id: "advanced", name: "Avançado", description: "Fluente em grande parte das situações" }
    ];

    const goals = [
        {
            id: "casual",
            name: "Casual",
            description: "Aprender no seu próprio ritmo",
            icon: "🏖️",
            intensity: "Suave"
        },
        {
            id: "regular",
            name: "Regular",
            description: "Progresso constante e consistente",
            icon: "🚶",
            intensity: "Moderado"
        },
        {
            id: "serious",
            name: "Intensivo",
            description: "Aprendizado acelerado e dedicado",
            icon: "🏃",
            intensity: "Exigente"
        },
        {
            id: "professional",
            name: "Profissional",
            description: "Preparo para uso profissional do idioma",
            icon: "💼",
            intensity: "Intenso"
        }
    ];

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
            >
                <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">Personalize sua experiência de aprendizado</h2>

                {/* Level selection */}
                <div className="mb-10">
                    <h3 className="text-xl font-semibold mb-4">Qual é o seu nível atual?</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {levels.map((level) => (
                            <motion.div
                                key={level.id}
                                whileHover={{ y: -5 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => setSelectedLevel(level.id)}
                                className={cn(
                                    "rounded-xl p-4 border cursor-pointer transition-all duration-300",
                                    selectedLevel === level.id
                                        ? (isDark ? "bg-cyan-900/50 border-cyan-700" : "bg-cyan-50 border-cyan-200")
                                        : (isDark ? "bg-gray-800/50 border-gray-700 hover:bg-gray-800" : "bg-white border-gray-200 hover:bg-gray-50")
                                )}
                            >
                                <div className="flex flex-col h-full">
                                    <h4 className="font-medium mb-1">{level.name}</h4>
                                    <p className={cn(
                                        "text-sm mb-4",
                                        isDark ? "text-gray-400" : "text-gray-600"
                                    )}>
                                        {level.description}
                                    </p>

                                    {selectedLevel === level.id && (
                                        <div className={cn(
                                            "mt-auto flex items-center justify-center text-xs gap-1 rounded-lg py-1",
                                            isDark ? "bg-cyan-500/20 text-cyan-300" : "bg-cyan-100 text-cyan-700"
                                        )}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 6 9 17l-5-5" />
                                            </svg>
                                            <span>Selecionado</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Goal selection */}
                <div className="mb-10">
                    <h3 className="text-xl font-semibold mb-4">Qual é o seu objetivo?</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {goals.map((goal) => (
                            <motion.div
                                key={goal.id}
                                whileHover={{ y: -5 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => setSelectedGoal(goal.id)}
                                className={cn(
                                    "rounded-xl p-4 border cursor-pointer transition-all duration-300",
                                    selectedGoal === goal.id
                                        ? (isDark ? "bg-cyan-900/50 border-cyan-700" : "bg-cyan-50 border-cyan-200")
                                        : (isDark ? "bg-gray-800/50 border-gray-700 hover:bg-gray-800" : "bg-white border-gray-200 hover:bg-gray-50")
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-3xl">{goal.icon}</div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <h4 className="font-medium">{goal.name}</h4>
                                            <div className={cn(
                                                "text-xs px-2 py-0.5 rounded-full",
                                                goal.id === "casual" ? (isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700") :
                                                    goal.id === "regular" ? (isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-700") :
                                                        goal.id === "serious" ? (isDark ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-700") :
                                                            (isDark ? "bg-purple-500/20 text-purple-400" : "bg-purple-100 text-purple-700")
                                            )}>
                                                {goal.intensity}
                                            </div>
                                        </div>

                                        <p className={cn(
                                            "text-sm",
                                            isDark ? "text-gray-400" : "text-gray-600"
                                        )}>
                                            {goal.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Time commitment */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Quanto tempo por dia você pode dedicar ao estudo?</h3>

                    <div className={cn(
                        "rounded-xl p-6 border",
                        isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
                    )}>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-500">
                                    {selectedTime} minutos
                                </span>
                                <p className={cn(
                                    "text-sm mt-2",
                                    isDark ? "text-gray-400" : "text-gray-600"
                                )}>
                                    {selectedTime < 10 ? "Um pouco todos os dias já ajuda!" :
                                        selectedTime < 20 ? "Ótimo para um progresso constante" :
                                            selectedTime < 40 ? "Excelente compromisso com o aprendizado!" :
                                                "Você vai avançar muito rápido!"}
                                </p>
                            </div>

                            <div className="w-full md:w-2/3">
                                <input
                                    type="range"
                                    min="5"
                                    max="60"
                                    step="5"
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(parseInt(e.target.value))}
                                    className={cn(
                                        "w-full h-2 rounded-full appearance-none",
                                        isDark ? "bg-gray-700" : "bg-gray-200",
                                        "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full",
                                        isDark ? "[&::-webkit-slider-thumb]:bg-cyan-500" : "[&::-webkit-slider-thumb]:bg-cyan-500"
                                    )}
                                />

                                <div className="flex justify-between mt-2 text-xs">
                                    <span>5 min</span>
                                    <span>15 min</span>
                                    <span>30 min</span>
                                    <span>45 min</span>
                                    <span>60 min</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-4 border border-cyan-500/20 text-sm flex items-start gap-3">
                    <div className="text-cyan-500 shrink-0 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4" />
                            <path d="M12 8h.01" />
                        </svg>
                    </div>
                    <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                        Com base nas suas seleções, o WordPanda criará um plano de estudos personalizado que se adapta ao seu estilo de vida. Nossa tecnologia de IA ajustará continuamente seu plano conforme você progride para manter o equilíbrio ideal entre desafio e motivação.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
