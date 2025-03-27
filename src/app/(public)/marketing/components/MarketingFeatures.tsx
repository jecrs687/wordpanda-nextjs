'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { Gamepad2, Languages, LightbulbIcon, LineChart, MessageCircle, Sparkles, Target, Users } from 'lucide-react';
import { useTheme } from 'next-themes';

const features = [
    {
        icon: <Gamepad2 className="h-6 w-6" />,
        name: "Jogos Interativos",
        description: "Aprenda jogando com nossos exercícios gamificados para reforçar vocabulário e gramática.",
        color: "emerald"
    },
    {
        icon: <LineChart className="h-6 w-6" />,
        name: "Progresso Detalhado",
        description: "Acompanhe seu desenvolvimento com métricas claras e visualizações intuitivas de seu aprendizado.",
        color: "sky"
    },
    {
        icon: <Users className="h-6 w-6" />,
        name: "Comunidade Global",
        description: "Conecte-se com estudantes de todo o mundo e pratique em conversas reais.",
        color: "indigo"
    },
    {
        icon: <Sparkles className="h-6 w-6" />,
        name: "IA Personalizada",
        description: "Nossa inteligência artificial adapta o conteúdo ao seu ritmo e estilo de aprendizado.",
        color: "purple"
    },
    {
        icon: <Languages className="h-6 w-6" />,
        name: "Múltiplos Idiomas",
        description: "Do espanhol ao mandarim, oferecemos uma ampla variedade de idiomas para você explorar.",
        color: "amber"
    },
    {
        icon: <MessageCircle className="h-6 w-6" />,
        name: "Assistente PandaAI",
        description: "Tire dúvidas e receba explicações instantâneas com nosso assistente inteligente.",
        color: "rose"
    },
    {
        icon: <Target className="h-6 w-6" />,
        name: "Metas Personalizadas",
        description: "Defina objetivos específicos e acompanhe seu progresso rumo à fluência.",
        color: "cyan"
    },
    {
        icon: <LightbulbIcon className="h-6 w-6" />,
        name: "Dicas Contextuais",
        description: "Receba sugestões inteligentes baseadas em seu histórico de aprendizado.",
        color: "green"
    }
];

export const MarketingFeatures = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <section className="py-20 px-4 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className={cn(
                            "inline-block px-4 py-1 rounded-full text-sm font-medium mb-4",
                            isDark
                                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                        )}
                    >
                        Recursos Incríveis
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold mb-6"
                    >
                        Tudo que você precisa para <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">dominar</span> um novo idioma
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className={cn(
                            "max-w-3xl mx-auto text-lg",
                            isDark ? "text-zinc-300" : "text-zinc-700"
                        )}
                    >
                        Nossa plataforma combina as mais avançadas tecnologias educacionais para criar uma experiência de aprendizado natural e envolvente
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{
                                y: -5,
                                boxShadow: isDark
                                    ? "0 10px 30px -10px rgba(0, 0, 0, 0.3)"
                                    : "0 10px 30px -10px rgba(0, 0, 0, 0.1)"
                            }}
                            className={cn(
                                "rounded-xl p-6 border transition-all duration-300",
                                isDark
                                    ? "bg-gray-900/50 backdrop-blur-sm border-gray-800/60"
                                    : "bg-white backdrop-blur-sm border-gray-200/60"
                            )}
                        >
                            <div className={cn(
                                "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                                feature.color === "emerald" ? (isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-600") :
                                    feature.color === "sky" ? (isDark ? "bg-sky-500/20 text-sky-400" : "bg-sky-100 text-sky-600") :
                                        feature.color === "indigo" ? (isDark ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-100 text-indigo-600") :
                                            feature.color === "purple" ? (isDark ? "bg-purple-500/20 text-purple-400" : "bg-purple-100 text-purple-600") :
                                                feature.color === "amber" ? (isDark ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-600") :
                                                    feature.color === "rose" ? (isDark ? "bg-rose-500/20 text-rose-400" : "bg-rose-100 text-rose-600") :
                                                        feature.color === "cyan" ? (isDark ? "bg-cyan-500/20 text-cyan-400" : "bg-cyan-100 text-cyan-600") :
                                                            (isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-600")
                            )}>
                                {feature.icon}
                            </div>

                            <h3 className="text-lg font-semibold mb-2">{feature.name}</h3>

                            <p className={cn(
                                "text-sm",
                                isDark ? "text-zinc-400" : "text-zinc-600"
                            )}>
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
