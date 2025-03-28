'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { BrainCircuit, Lightbulb, Network, RefreshCw, Repeat, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function LearningMethod() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        setMounted(true);

        // Auto-rotate steps for demo
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % 5);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    if (!mounted) return null;

    const isDark = theme === 'dark';

    const steps = [
        {
            title: "Exposição Viral",
            description: "Entre em contato com vocabulário e expressões que estão bombando no mundo.",
            icon: <Network className="w-6 h-6" />,
            color: "cyan"
        },
        {
            title: "Repetição Espaçada",
            description: "Revise as palavras no momento ideal para fixação na memória de longo prazo.",
            icon: <Repeat className="w-6 h-6" />,
            color: "purple"
        },
        {
            title: "Desafios Gamificados",
            description: "Participe de jogos rápidos para testar seu conhecimento de forma divertida.",
            icon: <Sparkles className="w-6 h-6" />,
            color: "yellow"
        },
        {
            title: "Ciclo de Feedback",
            description: "Receba análises imediatas e ajuste seu aprendizado para melhor eficiência.",
            icon: <RefreshCw className="w-6 h-6" />,
            color: "green"
        },
        {
            title: "Retenção Neurológica",
            description: "Memorize naturalmente através de associações e contextos significativos.",
            icon: <BrainCircuit className="w-6 h-6" />,
            color: "pink"
        }
    ];

    const getColorClass = (color, isDark, type) => {
        const colorMap = {
            cyan: {
                bgLight: isDark ? "bg-cyan-500/10" : "bg-cyan-50",
                bgStrong: isDark ? "bg-cyan-500/20" : "bg-cyan-100",
                text: isDark ? "text-cyan-400" : "text-cyan-700",
                border: isDark ? "border-cyan-500/20" : "border-cyan-200",
                gradientFrom: "from-cyan-500",
                gradientTo: "to-blue-500"
            },
            purple: {
                bgLight: isDark ? "bg-purple-500/10" : "bg-purple-50",
                bgStrong: isDark ? "bg-purple-500/20" : "bg-purple-100",
                text: isDark ? "text-purple-400" : "text-purple-700",
                border: isDark ? "border-purple-500/20" : "border-purple-200",
                gradientFrom: "from-purple-500",
                gradientTo: "to-pink-500"
            },
            yellow: {
                bgLight: isDark ? "bg-yellow-500/10" : "bg-yellow-50",
                bgStrong: isDark ? "bg-yellow-500/20" : "bg-yellow-100",
                text: isDark ? "text-yellow-400" : "text-yellow-700",
                border: isDark ? "border-yellow-500/20" : "border-yellow-200",
                gradientFrom: "from-yellow-500",
                gradientTo: "to-orange-500"
            },
            green: {
                bgLight: isDark ? "bg-emerald-500/10" : "bg-emerald-50",
                bgStrong: isDark ? "bg-emerald-500/20" : "bg-emerald-100",
                text: isDark ? "text-emerald-400" : "text-emerald-700",
                border: isDark ? "border-emerald-500/20" : "border-emerald-200",
                gradientFrom: "from-emerald-500",
                gradientTo: "to-teal-500"
            },
            pink: {
                bgLight: isDark ? "bg-pink-500/10" : "bg-pink-50",
                bgStrong: isDark ? "bg-pink-500/20" : "bg-pink-100",
                text: isDark ? "text-pink-400" : "text-pink-700",
                border: isDark ? "border-pink-500/20" : "border-pink-200",
                gradientFrom: "from-pink-500",
                gradientTo: "to-red-500"
            }
        };

        return colorMap[color][type];
    };

    return (
        <section className="py-16 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className={cn(
                    "absolute top-0 left-0 w-1/2 h-1/2 rounded-full blur-3xl opacity-20 -z-10",
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
                            "inline-block px-4 py-1 rounded-full text-sm font-medium mb-4",
                            isDark
                                ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                : "bg-yellow-50 text-yellow-700 border border-yellow-100"
                        )}
                    >
                        Método Comprovado
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold mb-4"
                    >
                        Domine idiomas com o{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-orange-500">
                            método viral
                        </span>
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
                        Nossa abordagem científica combina neurociência, psicologia e gamificação para um aprendizado rápido e duradouro
                    </motion.p>
                </div>

                <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">
                    {/* Steps */}
                    <div className="lg:w-1/2">
                        <div className="space-y-4">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className={cn(
                                        "p-4 rounded-xl border transition-all duration-300 cursor-pointer",
                                        activeStep === index
                                            ? cn(
                                                "border",
                                                isDark
                                                    ? `${getColorClass(step.color, isDark, 'bgLight')} ${getColorClass(step.color, isDark, 'border')}`
                                                    : `${getColorClass(step.color, isDark, 'bgLight')} ${getColorClass(step.color, isDark, 'border')} shadow-md`
                                            )
                                            : (isDark ? "bg-gray-900/50 border-gray-800" : "bg-white/50 border-gray-200")
                                    )}
                                    onClick={() => setActiveStep(index)}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                            getColorClass(step.color, isDark, 'bgStrong'),
                                            getColorClass(step.color, isDark, 'text')
                                        )}>
                                            {step.icon}
                                        </div>
                                        <div>
                                            <h3 className={cn(
                                                "text-lg font-semibold mb-1",
                                                activeStep === index
                                                    ? getColorClass(step.color, isDark, 'text')
                                                    : (isDark ? "text-white" : "text-gray-900")
                                            )}>
                                                {step.title}
                                            </h3>
                                            <p className={cn(
                                                "text-sm",
                                                isDark ? "text-gray-400" : "text-gray-600"
                                            )}>
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Visualization */}
                    <div className="lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className={cn(
                                "absolute inset-0 rounded-3xl blur-lg",
                                `bg-gradient-to-r ${getColorClass(steps[activeStep].color, isDark, 'gradientFrom')} ${getColorClass(steps[activeStep].color, isDark, 'gradientTo')} opacity-20`
                            )} />

                            <div className={cn(
                                "relative p-6 rounded-2xl border backdrop-blur-sm",
                                isDark
                                    ? "bg-gray-900/80 border-gray-800"
                                    : "bg-white border-gray-200 shadow-lg"
                            )}>
                                <div className="mb-6 flex justify-center">
                                    <div className={cn(
                                        "w-16 h-16 rounded-2xl flex items-center justify-center",
                                        getColorClass(steps[activeStep].color, isDark, 'bgStrong'),
                                        getColorClass(steps[activeStep].color, isDark, 'text')
                                    )}>
                                        <Lightbulb className="w-8 h-8" />
                                    </div>
                                </div>

                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold mb-2">
                                        Você sabia?
                                    </h3>
                                    <p className={cn(
                                        "text-sm",
                                        isDark ? "text-gray-300" : "text-gray-700"
                                    )}>
                                        {activeStep === 0 && "Pessoas aprendem 78% mais rápido quando expostas a conteúdo que está em alta, pois há mais conexões contextuais no cérebro."}
                                        {activeStep === 1 && "Revisar palavras em intervalos específicos aumenta em 80% as chances de memorização a longo prazo em comparação com estudos intensivos."}
                                        {activeStep === 2 && "A gamificação aumenta o engajamento em 60% e reduz a desistência nos estudos em até 45%, segundo pesquisas recentes."}
                                        {activeStep === 3 && "Feedback imediato durante o aprendizado aumenta a taxa de retenção em 68% e melhora a confiança do estudante."}
                                        {activeStep === 4 && "O cérebro forma conexões neurais 3x mais fortes quando associa novas palavras com emoções, imagens e contextos significativos."}
                                    </p>
                                </div>

                                <div className={cn(
                                    "p-4 rounded-xl border",
                                    isDark
                                        ? `${getColorClass(steps[activeStep].color, isDark, 'bgLight')} ${getColorClass(steps[activeStep].color, isDark, 'border')}`
                                        : `${getColorClass(steps[activeStep].color, isDark, 'bgLight')} ${getColorClass(steps[activeStep].color, isDark, 'border')}`
                                )}>
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xl",
                                            isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
                                        )}>
                                            {activeStep === 0 && "🌍"}
                                            {activeStep === 1 && "⏱️"}
                                            {activeStep === 2 && "🎮"}
                                            {activeStep === 3 && "↩️"}
                                            {activeStep === 4 && "🧠"}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-sm">Em ação no WordPanda</h4>
                                            <p className={cn(
                                                "text-xs",
                                                isDark ? "text-gray-300" : "text-gray-700"
                                            )}>
                                                {activeStep === 0 && "Conteúdo atualizado diariamente com palavras e expressões em alta nas redes sociais e mídia global."}
                                                {activeStep === 1 && "Sistema inteligente que identifica quando você precisa revisar cada palavra baseado na sua curva de aprendizado pessoal."}
                                                {activeStep === 2 && "Jogos rápidos e desafios diários que transformam o aprendizado em uma competição divertida e viciante."}
                                                {activeStep === 3 && "Análises detalhadas do seu desempenho com dicas personalizadas para focar nos seus pontos fracos."}
                                                {activeStep === 4 && "Técnicas de associação avançadas que conectam palavras com memes, vídeos virais e situações do cotidiano."}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-center">
                                    <div className="flex space-x-2">
                                        {steps.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setActiveStep(index)}
                                                className={cn(
                                                    "w-2 h-2 rounded-full transition-all",
                                                    activeStep === index
                                                        ? `w-8 ${getColorClass(steps[activeStep].color, isDark, 'bgStrong')}`
                                                        : (isDark ? "bg-gray-700" : "bg-gray-300")
                                                )}
                                                aria-label={`View step ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
