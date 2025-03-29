'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useState } from 'react';

export const Step4ProgressTracking = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [activeTab, setActiveTab] = useState('statistics');

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
            >
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Como o WordPanda acompanha seu progresso</h2>

                {/* Progress tabs */}
                <div className="flex justify-center mb-8">
                    <div className={cn(
                        "inline-flex rounded-xl p-1 border",
                        isDark ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200"
                    )}>
                        {[
                            { id: 'statistics', label: 'Estatísticas' },
                            { id: 'achievements', label: 'Conquistas' },
                            { id: 'insights', label: 'Insights' }
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

                {/* Statistics content */}
                {activeTab === 'statistics' && (
                    <div className={cn(
                        "rounded-xl border",
                        isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
                    )}>
                        <div className="p-4 border-b flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">📊</span>
                                <span className="font-medium">Resumo de Aprendizado: Espanhol</span>
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-xs px-2 py-1 rounded-full",
                                isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-600"
                            )}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                                    <polyline points="16 7 22 7 22 13" />
                                </svg>
                                <span>+12% esta semana</span>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                {[
                                    { label: 'Palavras Aprendidas', value: '248', icon: '📚', color: 'cyan' },
                                    { label: 'Sequência Atual', value: '7 dias', icon: '🔥', color: 'amber' },
                                    { label: 'Tempo Total', value: '18h 26m', icon: '⏱️', color: 'indigo' },
                                    { label: 'Nível', value: 'Intermediário', icon: '🏆', color: 'emerald' }
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "p-4 rounded-xl border",
                                            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 shadow-sm"
                                        )}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="text-xl">{item.icon}</div>
                                            <p className={cn(
                                                "text-sm",
                                                isDark ? "text-gray-400" : "text-gray-600"
                                            )}>
                                                {item.label}
                                            </p>
                                        </div>
                                        <p className={cn(
                                            "text-2xl font-bold",
                                            item.color === "cyan" ? (isDark ? "text-cyan-400" : "text-cyan-600") :
                                                item.color === "amber" ? (isDark ? "text-amber-400" : "text-amber-600") :
                                                    item.color === "indigo" ? (isDark ? "text-indigo-400" : "text-indigo-600") :
                                                        (isDark ? "text-emerald-400" : "text-emerald-600")
                                        )}>
                                            {item.value}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Progress by categories */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-4">Progresso por Categorias</h3>
                                <div className="space-y-4">
                                    {[
                                        { category: 'Vocabulário', progress: 65, color: 'emerald' },
                                        { category: 'Gramática', progress: 42, color: 'indigo' },
                                        { category: 'Conversação', progress: 78, color: 'amber' },
                                        { category: 'Compreensão', progress: 55, color: 'cyan' }
                                    ].map((item, index) => (
                                        <div key={index} className="space-y-1">
                                            <div className="flex justify-between">
                                                <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                                                    {item.category}
                                                </p>
                                                <p className={cn(
                                                    "font-medium",
                                                    item.color === "emerald" ? (isDark ? "text-emerald-400" : "text-emerald-600") :
                                                        item.color === "indigo" ? (isDark ? "text-indigo-400" : "text-indigo-600") :
                                                            item.color === "amber" ? (isDark ? "text-amber-400" : "text-amber-600") :
                                                                (isDark ? "text-cyan-400" : "text-cyan-600")
                                                )}>
                                                    {item.progress}%
                                                </p>
                                            </div>
                                            <div className={cn(
                                                "h-2 rounded-full overflow-hidden",
                                                isDark ? "bg-gray-700" : "bg-gray-200"
                                            )}>
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full",
                                                        item.color === "emerald" ? "bg-gradient-to-r from-emerald-500 to-green-500" :
                                                            item.color === "indigo" ? "bg-gradient-to-r from-indigo-500 to-purple-500" :
                                                                item.color === "amber" ? "bg-gradient-to-r from-amber-500 to-yellow-500" :
                                                                    "bg-gradient-to-r from-cyan-500 to-blue-500"
                                                    )}
                                                    style={{ width: `${item.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Weekly activity chart */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Atividade Semanal</h3>
                                <div className={cn(
                                    "p-4 rounded-xl border",
                                    isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 shadow-sm"
                                )}>
                                    <div className="flex justify-between items-end h-40 mb-2">
                                        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day, index) => {
                                            const heights = [60, 45, 75, 30, 90, 65, 50];
                                            return (
                                                <div key={index} className="flex flex-col items-center">
                                                    <div
                                                        className={cn(
                                                            "w-8 rounded-t-md",
                                                            index === 4 ? "bg-gradient-to-t from-emerald-500 to-cyan-500" :
                                                                (isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300")
                                                        )}
                                                        style={{ height: `${heights[index]}%` }}
                                                    ></div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-between">
                                        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day, index) => (
                                            <div key={index} className="text-center">
                                                <span className={cn(
                                                    "text-xs",
                                                    index === 4
                                                        ? (isDark ? "text-emerald-400" : "text-emerald-600")
                                                        : (isDark ? "text-gray-400" : "text-gray-600")
                                                )}>
                                                    {day}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Achievements content */}
                {activeTab === 'achievements' && (
                    <div className={cn(
                        "rounded-xl border",
                        isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
                    )}>
                        <div className="p-4 border-b flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">🏆</span>
                                <span className="font-medium">Suas Conquistas</span>
                            </div>
                            <div className={cn(
                                "text-xs px-2 py-1 rounded-full",
                                isDark ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-100 text-indigo-600"
                            )}>
                                12 de 30 conquistadas
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                {[
                                    { name: 'Primeiro Passo', description: 'Complete sua primeira lição', icon: '👣', date: '12 de maio', color: 'emerald', unlocked: true },
                                    { name: 'Sequência de 7 Dias', description: 'Estude por 7 dias consecutivos', icon: '🔥', date: 'Hoje', color: 'amber', unlocked: true },
                                    { name: 'Vocabulário Nível 1', description: 'Aprenda 100 palavras', icon: '📚', date: '18 de maio', color: 'cyan', unlocked: true },
                                    { name: 'Mestre da Gramática', description: 'Acerte 50 exercícios de gramática', icon: '🖋️', date: '21 de maio', color: 'indigo', unlocked: true },
                                    { name: 'Poliglota Iniciante', description: 'Comece a aprender um segundo idioma', icon: '🌎', date: null, color: 'purple', unlocked: false },
                                    { name: 'Conversador', description: 'Complete 10 sessões de conversação', icon: '💬', date: null, color: 'pink', unlocked: false }
                                ].map((achievement, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "p-4 rounded-xl border relative",
                                            achievement.unlocked
                                                ? (isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 shadow-sm")
                                                : (isDark ? "bg-gray-800/50 border-gray-700/50 opacity-60" : "bg-gray-100 border-gray-200/50 opacity-60")
                                        )}
                                    >
                                        {achievement.unlocked && (
                                            <div className={cn(
                                                "absolute top-3 right-3 w-2 h-2 rounded-full",
                                                achievement.color === "emerald" ? "bg-emerald-500" :
                                                    achievement.color === "amber" ? "bg-amber-500" :
                                                        achievement.color === "cyan" ? "bg-cyan-500" :
                                                            achievement.color === "indigo" ? "bg-indigo-500" :
                                                                achievement.color === "purple" ? "bg-purple-500" :
                                                                    "bg-pink-500"
                                            )}></div>
                                        )}

                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center text-lg",
                                                achievement.unlocked
                                                    ? (achievement.color === "emerald" ? (isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-600") :
                                                        achievement.color === "amber" ? (isDark ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-600") :
                                                            achievement.color === "cyan" ? (isDark ? "bg-cyan-500/20 text-cyan-400" : "bg-cyan-100 text-cyan-600") :
                                                                achievement.color === "indigo" ? (isDark ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-100 text-indigo-600") :
                                                                    achievement.color === "purple" ? (isDark ? "bg-purple-500/20 text-purple-400" : "bg-purple-100 text-purple-600") :
                                                                        (isDark ? "bg-pink-500/20 text-pink-400" : "bg-pink-100 text-pink-600"))
                                                    : (isDark ? "bg-gray-700 text-gray-500" : "bg-gray-200 text-gray-500")
                                            )}>
                                                {achievement.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-medium">{achievement.name}</h4>
                                                <p className={cn(
                                                    "text-xs",
                                                    isDark ? "text-gray-400" : "text-gray-600"
                                                )}>
                                                    {achievement.description}
                                                </p>
                                            </div>
                                        </div>

                                        {achievement.unlocked ? (
                                            <div className={cn(
                                                "text-xs px-3 py-1 rounded-full w-fit",
                                                isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
                                            )}>
                                                Conquistado em {achievement.date}
                                            </div>
                                        ) : (
                                            <div className={cn(
                                                "text-xs px-3 py-1 rounded-full w-fit",
                                                isDark ? "bg-gray-700/50 text-gray-400" : "bg-gray-200 text-gray-500"
                                            )}>
                                                Bloqueado
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="text-center">
                                <button
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium",
                                        isDark
                                            ? "bg-gray-700 text-white hover:bg-gray-600"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    )}
                                >
                                    Ver todas as conquistas
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Insights content */}
                {activeTab === 'insights' && (
                    <div className={cn(
                        "rounded-xl border",
                        isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
                    )}>
                        <div className="p-4 border-b flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">💡</span>
                                <span className="font-medium">Insights Personalizados</span>
                            </div>
                            <div className={cn(
                                "text-xs px-2 py-1 rounded-full",
                                isDark ? "bg-cyan-500/20 text-cyan-400" : "bg-cyan-100 text-cyan-600"
                            )}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-1">
                                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                                    <path d="m9 12 2 2 4-4" />
                                </svg>
                                Atualizado hoje
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Point distribution */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-4">Seus pontos fortes e áreas de melhoria</h3>
                                <div className={cn(
                                    "p-4 rounded-xl border mb-4",
                                    isDark ? "bg-emerald-900/20 border-emerald-800" : "bg-emerald-50 border-emerald-200"
                                )}>
                                    <h4 className="font-medium mb-1 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isDark ? "text-emerald-400" : "text-emerald-600"}>
                                            <path d="M20 6 9 17l-5-5" />
                                        </svg>
                                        <span>Pontos fortes</span>
                                    </h4>
                                    <ul className="pl-6 list-disc space-y-1">
                                        <li className={isDark ? "text-gray-300" : "text-gray-700"}>Vocabulário relacionado a viagens e alimentação</li>
                                        <li className={isDark ? "text-gray-300" : "text-gray-700"}>Verbos no presente do indicativo</li>
                                        <li className={isDark ? "text-gray-300" : "text-gray-700"}>Reconhecimento de palavras cognatas</li>
                                    </ul>
                                </div>

                                <div className={cn(
                                    "p-4 rounded-xl border",
                                    isDark ? "bg-amber-900/20 border-amber-800" : "bg-amber-50 border-amber-200"
                                )}>
                                    <h4 className="font-medium mb-1 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isDark ? "text-amber-400" : "text-amber-600"}>
                                            <path d="M12 5v14" />
                                            <path d="M18 13l-6 6-6-6" />
                                        </svg>
                                        <span>Áreas de melhoria</span>
                                    </h4>
                                    <ul className="pl-6 list-disc space-y-1">
                                        <li className={isDark ? "text-gray-300" : "text-gray-700"}>Tempos verbais no passado</li>
                                        <li className={isDark ? "text-gray-300" : "text-gray-700"}>Vocabulário técnico e profissional</li>
                                        <li className={isDark ? "text-gray-300" : "text-gray-700"}>Preposições e seu uso correto</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Personalized suggestions */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Recomendações personalizadas</h3>
                                <div className="space-y-4">
                                    {[
                                        {
                                            title: "Pratique mais verbos no passado",
                                            description: "Identificamos que você tem dificuldade com os tempos verbais no passado. Recomendamos focar nos exercícios de conjugação.",
                                            icon: "🖋️",
                                            color: "indigo",
                                            cta: "Ir para exercícios"
                                        },
                                        {
                                            title: "Nova coleção de vocabulário disponível",
                                            description: "Com base nos seus interesses, criamos uma nova coleção de vocabulário sobre tecnologia e negócios.",
                                            icon: "📚",
                                            color: "cyan",
                                            cta: "Ver vocabulário"
                                        },
                                        {
                                            title: "Experimente nosso novo jogo de preposições",
                                            description: "Para ajudar com o uso correto das preposições, nosso novo jogo interativo pode tornar o aprendizado mais divertido.",
                                            icon: "🎮",
                                            color: "emerald",
                                            cta: "Jogar agora"
                                        }
                                    ].map((suggestion, index) => (
                                        <div
                                            key={index}
                                            className={cn(
                                                "p-4 rounded-xl border flex gap-4",
                                                isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 shadow-sm"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-10 h-10 shrink-0 rounded-lg flex items-center justify-center text-lg",
                                                suggestion.color === "indigo" ? (isDark ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-100 text-indigo-600") :
                                                    suggestion.color === "cyan" ? (isDark ? "bg-cyan-500/20 text-cyan-400" : "bg-cyan-100 text-cyan-600") :
                                                        (isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-600")
                                            )}>
                                                {suggestion.icon}
                                            </div>

                                            <div className="flex-1">
                                                <h4 className="font-medium mb-1">{suggestion.title}</h4>
                                                <p className={cn(
                                                    "text-sm mb-3",
                                                    isDark ? "text-gray-400" : "text-gray-600"
                                                )}>
                                                    {suggestion.description}
                                                </p>
                                                <button className={cn(
                                                    "text-xs px-3 py-1 rounded-lg",
                                                    suggestion.color === "indigo" ? (isDark ? "bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30" : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200") :
                                                        suggestion.color === "cyan" ? (isDark ? "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30" : "bg-cyan-100 text-cyan-600 hover:bg-cyan-200") :
                                                            (isDark ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30" : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200")
                                                )}>
                                                    {suggestion.cta}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
                        O WordPanda usa algoritmos de inteligência artificial para analisar seu desempenho e fornecer insights personalizados, adaptando o conteúdo às suas necessidades específicas. Quanto mais você usa a plataforma, mais preciso se torna o sistema de recomendação.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
