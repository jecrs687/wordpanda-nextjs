'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useState } from 'react';

export const Step3FeatureDemo = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [activeTab, setActiveTab] = useState('exercise');
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const handleAnswer = (index: number) => {
        setSelectedAnswer(index);
        setTimeout(() => {
            setShowExplanation(true);
        }, 500);
    };

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
            >
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Experimente os recursos do WordPanda</h2>

                {/* Feature tabs */}
                <div className="flex justify-center mb-8">
                    <div className={cn(
                        "inline-flex rounded-xl p-1 border",
                        isDark ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200"
                    )}>
                        {[
                            { id: 'exercise', label: 'Exercícios' },
                            { id: 'vocabulary', label: 'Vocabulário' },
                            { id: 'conversation', label: 'Conversação' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                    activeTab === tab.id
                                        ? (isDark ? "bg-gray-700 text-white" : "bg-white text-gray-900 shadow-sm")
                                        : (isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900")
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Exercise content */}
                {activeTab === 'exercise' && (
                    <div className={cn(
                        "rounded-xl border overflow-hidden",
                        isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
                    )}>
                        <div className="p-4 border-b flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">🇪🇸</span>
                                <span className="font-medium">Espanhol: Lição 3</span>
                            </div>
                            <div className={cn(
                                "text-xs px-2 py-1 rounded-full",
                                isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-600"
                            )}>
                                Iniciante
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-6">Selecione a tradução correta:</h3>

                            <div className="mb-8">
                                <div className={cn(
                                    "mb-6 p-4 rounded-lg text-center text-xl font-medium",
                                    isDark ? "bg-gray-700" : "bg-gray-100"
                                )}>
                                    "Me gusta estudiar idiomas"
                                </div>

                                <div className="space-y-3">
                                    {[
                                        "Eu gosto de estudar história",
                                        "Eu gosto de estudar idiomas",
                                        "Eu preciso estudar idiomas",
                                        "Eu quero estudar idiomas"
                                    ].map((option, index) => (
                                        <motion.button
                                            key={index}
                                            onClick={() => handleAnswer(index)}
                                            disabled={selectedAnswer !== null}
                                            whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                                            className={cn(
                                                "w-full p-4 rounded-xl border text-left transition-all duration-200",
                                                selectedAnswer === null
                                                    ? (isDark ? "bg-gray-800 border-gray-700 hover:border-gray-600" : "bg-white border-gray-200 hover:border-gray-300")
                                                    : selectedAnswer === index
                                                        ? (index === 1
                                                            ? (isDark ? "bg-emerald-900/50 border-emerald-700" : "bg-emerald-50 border-emerald-200")
                                                            : (isDark ? "bg-red-900/50 border-red-700" : "bg-red-50 border-red-200")
                                                        )
                                                        : index === 1 && selectedAnswer !== null
                                                            ? (isDark ? "bg-emerald-900/50 border-emerald-700 opacity-50" : "bg-emerald-50 border-emerald-200 opacity-50")
                                                            : (isDark ? "bg-gray-800 border-gray-700 opacity-50" : "bg-white border-gray-200 opacity-50")
                                            )}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span>{option}</span>
                                                {selectedAnswer !== null && (
                                                    <span>
                                                        {index === 1 ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isDark ? "text-emerald-400" : "text-emerald-600"}>
                                                                <path d="M20 6 9 17l-5-5" />
                                                            </svg>
                                                        ) : selectedAnswer === index ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isDark ? "text-red-400" : "text-red-600"}>
                                                                <path d="M18 6 6 18" />
                                                                <path d="m6 6 12 12" />
                                                            </svg>
                                                        ) : null}
                                                    </span>
                                                )}
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {showExplanation && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "p-4 rounded-xl border",
                                        selectedAnswer === 1
                                            ? (isDark ? "bg-emerald-900/20 border-emerald-800" : "bg-emerald-50 border-emerald-200")
                                            : (isDark ? "bg-amber-900/20 border-amber-800" : "bg-amber-50 border-amber-200")
                                    )}
                                >
                                    <h4 className="font-medium mb-2">Explicação:</h4>
                                    <p className={cn(
                                        "text-sm",
                                        isDark ? "text-gray-300" : "text-gray-700"
                                    )}>
                                        "Me gusta" significa "Eu gosto" em espanhol, e "estudiar idiomas" significa "estudar idiomas". A expressão completa "Me gusta estudiar idiomas" se traduz como "Eu gosto de estudar idiomas".
                                    </p>
                                </motion.div>
                            )}
                        </div>

                        <div className={cn(
                            "flex items-center justify-between p-4 border-t",
                            isDark ? "border-gray-700" : "border-gray-200"
                        )}>
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "h-2 rounded-full overflow-hidden w-32",
                                    isDark ? "bg-gray-700" : "bg-gray-200"
                                )}>
                                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 w-1/3"></div>
                                </div>
                                <span className="text-sm">1/3</span>
                            </div>

                            <button
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium",
                                    selectedAnswer === null
                                        ? (isDark ? "bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-gray-100 text-gray-400 cursor-not-allowed")
                                        : (isDark ? "bg-cyan-600 text-white hover:bg-cyan-500" : "bg-cyan-500 text-white hover:bg-cyan-600")
                                )}
                                disabled={selectedAnswer === null}
                            >
                                Continuar
                            </button>
                        </div>
                    </div>
                )}

                {/* Vocabulary content */}
                {activeTab === 'vocabulary' && (
                    <div className={cn(
                        "rounded-xl border",
                        isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
                    )}>
                        <div className="p-4 border-b flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">📚</span>
                                <span className="font-medium">Vocabulário: Comida e Bebida</span>
                            </div>
                            <div className={cn(
                                "text-xs px-2 py-1 rounded-full",
                                isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600"
                            )}>
                                8 palavras novas
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                {[
                                    { word: "Manzana", translation: "Maçã", image: "🍎" },
                                    { word: "Agua", translation: "Água", image: "💧" },
                                    { word: "Pan", translation: "Pão", image: "🍞" },
                                    { word: "Queso", translation: "Queijo", image: "🧀" },
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ y: -5 }}
                                        className={cn(
                                            "p-4 rounded-xl border flex items-center gap-4",
                                            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 shadow-sm"
                                        )}
                                    >
                                        <div className="text-3xl">{item.image}</div>
                                        <div>
                                            <div className="font-medium">{item.word}</div>
                                            <div className={cn(
                                                "text-sm",
                                                isDark ? "text-gray-400" : "text-gray-600"
                                            )}>
                                                {item.translation}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className={cn(
                                "p-4 rounded-xl border",
                                isDark ? "bg-cyan-900/20 border-cyan-800" : "bg-cyan-50 border-cyan-200"
                            )}>
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isDark ? "text-cyan-400" : "text-cyan-600"}>
                                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                                        <path d="m9 12 2 2 4-4" />
                                    </svg>
                                    <span>Você sabia?</span>
                                </h4>
                                <p className={cn(
                                    "text-sm",
                                    isDark ? "text-gray-300" : "text-gray-700"
                                )}>
                                    Em espanhol, a palavra "pan" (pão) vem do latim "panis", assim como a palavra portuguesa. Esta é uma das muitas conexões etimológicas entre o português e o espanhol que facilitam o aprendizado para falantes de português.
                                </p>
                            </div>
                        </div>

                        <div className={cn(
                            "flex items-center justify-between p-4 border-t",
                            isDark ? "border-gray-700" : "border-gray-200"
                        )}>
                            <button
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium",
                                    isDark ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                )}
                            >
                                Repetir com áudio
                            </button>

                            <button
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium",
                                    isDark ? "bg-cyan-600 text-white hover:bg-cyan-500" : "bg-cyan-500 text-white hover:bg-cyan-600"
                                )}
                            >
                                Praticar palavras
                            </button>
                        </div>
                    </div>
                )}

                {/* Conversation content */}
                {activeTab === 'conversation' && (
                    <div className={cn(
                        "rounded-xl border overflow-hidden",
                        isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
                    )}>
                        <div className="p-4 border-b flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">💬</span>
                                <span className="font-medium">PandaBot: Assistente de Conversação</span>
                            </div>
                            <div className={cn(
                                "text-xs px-2 py-1 rounded-full",
                                isDark ? "bg-purple-500/20 text-purple-400" : "bg-purple-100 text-purple-600"
                            )}>
                                AI Powered
                            </div>
                        </div>

                        <div className="p-6 h-[350px] overflow-y-auto">
                            <div className="space-y-4">
                                <div className={cn(
                                    "max-w-[80%] p-3 rounded-xl rounded-tl-none",
                                    isDark ? "bg-purple-500/20 text-white" : "bg-purple-100 text-gray-900"
                                )}>
                                    Olá! Eu sou o PandaBot, seu assistente de conversação para praticar espanhol. Como posso ajudar você hoje?
                                </div>

                                <div className={cn(
                                    "max-w-[80%] ml-auto p-3 rounded-xl rounded-tr-none",
                                    isDark ? "bg-cyan-600/30 text-white" : "bg-cyan-100 text-gray-900"
                                )}>
                                    Olá! Como se diz "Eu quero aprender espanhol" em espanhol?
                                </div>

                                <div className={cn(
                                    "max-w-[80%] p-3 rounded-xl rounded-tl-none",
                                    isDark ? "bg-purple-500/20 text-white" : "bg-purple-100 text-gray-900"
                                )}>
                                    Em espanhol, você diria: "Quiero aprender español"
                                </div>

                                <div className={cn(
                                    "max-w-[80%] ml-auto p-3 rounded-xl rounded-tr-none",
                                    isDark ? "bg-cyan-600/30 text-white" : "bg-cyan-100 text-gray-900"
                                )}>
                                    Quiero aprender español. Está correto?
                                </div>

                                <div className={cn(
                                    "max-w-[80%] p-3 rounded-xl rounded-tl-none",
                                    isDark ? "bg-purple-500/20 text-white" : "bg-purple-100 text-gray-900"
                                )}>
                                    <p className="mb-2">Sim, está perfeitamente correto! 👏</p>
                                    <p>Vamos praticar mais uma frase? Como você diria: "Eu gosto muito de música espanhola"</p>
                                </div>

                                <div className={cn(
                                    "max-w-[80%] ml-auto p-3 rounded-xl rounded-tr-none",
                                    isDark ? "bg-cyan-600/30 text-white" : "bg-cyan-100 text-gray-900"
                                )}>
                                    Me gusta mucho la música española?
                                </div>

                                <div className={cn(
                                    "max-w-[80%] p-3 rounded-xl rounded-tl-none",
                                    isDark ? "bg-purple-500/20 text-white" : "bg-purple-100 text-gray-900"
                                )}>
                                    <p className="mb-2">¡Excelente! Está perfectamente correcto. 🎉</p>
                                    <p>Você está indo muito bem! Gostaria de aprender mais sobre tempos verbais ou prefere praticar vocabulário de um tema específico?</p>
                                </div>
                            </div>
                        </div>

                        <div className={cn(
                            "p-4 border-t",
                            isDark ? "border-gray-700" : "border-gray-200"
                        )}>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Digite sua mensagem em português ou espanhol..."
                                    className={cn(
                                        "flex-1 px-4 py-2 rounded-lg text-sm",
                                        isDark
                                            ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                                            : "bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-500",
                                        "border focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                                    )}
                                />
                                <button
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium",
                                        isDark ? "bg-cyan-600 text-white hover:bg-cyan-500" : "bg-cyan-500 text-white hover:bg-cyan-600"
                                    )}
                                >
                                    Enviar
                                </button>
                            </div>
                            <div className="flex justify-between mt-2 text-xs">
                                <div className={cn(
                                    isDark ? "text-gray-400" : "text-gray-600"
                                )}>
                                    Dica: O assistente corrigirá seus erros e explicará as regras gramaticais
                                </div>
                                <button className={cn(
                                    "flex items-center gap-1",
                                    isDark ? "text-cyan-400 hover:text-cyan-300" : "text-cyan-600 hover:text-cyan-500"
                                )}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 18v-6" />
                                        <path d="M8 18v-1" />
                                        <path d="M16 18v-3" />
                                        <path d="M2 22h20" />
                                        <path d="M12 2v4" />
                                        <path d="m4.93 10.93 2.83-2.83" />
                                        <path d="M19.07 10.93 16.24 8.1" />
                                        <path d="M2 16h20" />
                                    </svg>
                                    <span>Ativar microfone</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-8 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-4 border border-cyan-500/20 text-sm flex items-start gap-3">
                    <div className="text-cyan-500 shrink-0 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4" />
                            <path d="M12 8h.01" />
                        </svg>
                    </div>
                    <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                        Além dos recursos mostrados aqui, o WordPanda oferece jogos interativos, histórias adaptadas ao seu nível, lembretes personalizados e muito mais. Tudo projetado com base em ciência cognitiva para maximizar sua retenção e tornar o aprendizado natural e divertido.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
