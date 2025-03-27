'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { Brain, Gamepad, Globe, LineChart, Target, Users } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { MarketingFooter } from '../components/MarketingFooter';
import { MarketingHeader } from '../components/MarketingHeader';

export default function FeaturesPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const features = [
        {
            icon: <Brain className="h-10 w-10" />,
            name: "Aprendizado Adaptativo",
            description: "Nossa tecnologia de IA analisa seu progresso e adapta o conteúdo ao seu nível, estilo de aprendizado e ritmo pessoal.",
            color: "from-purple-500 to-indigo-500",
            image: "/assets/marketing/adaptive-learning.webp"
        },
        {
            icon: <Gamepad className="h-10 w-10" />,
            name: "Jogos Interativos",
            description: "Aprenda através de jogos divertidos e desafiadores que reforçam vocabulário, gramática e pronúncia de maneira envolvente.",
            color: "from-emerald-500 to-green-500",
            image: "/assets/marketing/interactive-games.webp"
        },
        {
            icon: <LineChart className="h-10 w-10" />,
            name: "Métricas Detalhadas",
            description: "Acompanhe seu progresso com visualizações intuitivas e descubra seus pontos fortes e áreas que precisam de mais atenção.",
            color: "from-blue-500 to-cyan-500",
            image: "/assets/marketing/detailed-metrics.webp"
        },
        {
            icon: <Globe className="h-10 w-10" />,
            name: "Conteúdo Cultural",
            description: "Mergulhe na cultura dos idiomas através de conteúdo autêntico, expressões idiomáticas e contextos reais de comunicação.",
            color: "from-amber-500 to-orange-500",
            image: "/assets/marketing/cultural-content.webp"
        },
        {
            icon: <Users className="h-10 w-10" />,
            name: "Comunidade Global",
            description: "Conecte-se com falantes nativos e outros estudantes para praticar conversação e trocar experiências culturais.",
            color: "from-pink-500 to-rose-500",
            image: "/assets/marketing/global-community.webp"
        },
        {
            icon: <Target className="h-10 w-10" />,
            name: "Metas Personalizadas",
            description: "Defina objetivos específicos para seu aprendizado e acompanhe seu progresso com planos adaptados às suas necessidades.",
            color: "from-indigo-500 to-purple-500",
            image: "/assets/marketing/personalized-goals.webp"
        }
    ];

    return (
        <div className={`min-h-screen w-full ${isDark
            ? 'bg-gradient-to-b from-gray-950 via-blue-950/10 to-emerald-950/10 text-white'
            : 'bg-gradient-to-b from-white via-zinc-100/30 to-sky-50/30 text-gray-900'
            }`}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-600/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 -left-40 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-600/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-400/10 dark:bg-cyan-600/5 rounded-full blur-3xl"></div>
            </div>

            <MarketingHeader />

            <main className="pt-10 pb-20">
                {/* Hero section */}
                <section className="relative py-16 md:py-24 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className={cn(
                                "inline-block px-4 py-1 rounded-full text-sm font-medium mb-6",
                                isDark
                                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                    : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                            )}
                        >
                            Recursos Exclusivos
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6"
                        >
                            Cada recurso foi projetado para <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">impulsionar</span> seu aprendizado
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className={cn(
                                "text-lg md:text-xl max-w-3xl mx-auto mb-10",
                                isDark ? "text-zinc-300" : "text-zinc-700"
                            )}
                        >
                            Descubra como o WordPanda combina ciência cognitiva, tecnologia avançada e gamificação para criar a experiência de aprendizado de idiomas mais eficiente disponível atualmente
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link href="/register">
                                <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium shadow-lg hover:shadow-indigo-500/20 dark:hover:shadow-indigo-400/20 transform hover:-translate-y-1 transition-all duration-300">
                                    Comece Gratuitamente
                                </button>
                            </Link>
                            <Link href="/marketing/interactive-demo">
                                <button className={`px-8 py-4 rounded-xl font-medium shadow-md ${isDark
                                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm'
                                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                                    } transform hover:-translate-y-1 transition-all duration-300`}>
                                    Ver demonstração
                                </button>
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* Features section */}
                <section className="py-20 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="space-y-20">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.7 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
                                >
                                    {/* Feature content */}
                                    <div className="lg:w-1/2 space-y-6">
                                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white`}>
                                            {feature.icon}
                                        </div>

                                        <h2 className="text-3xl font-bold">{feature.name}</h2>

                                        <p className={cn(
                                            "text-lg",
                                            isDark ? "text-zinc-300" : "text-zinc-700"
                                        )}>
                                            {feature.description}
                                        </p>

                                        <ul className="space-y-3">
                                            {[1, 2, 3].map((item) => (
                                                <li key={item} className="flex items-start gap-3">
                                                    <div className={cn(
                                                        "mt-1 w-5 h-5 rounded-full flex items-center justify-center",
                                                        isDark ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-100 text-indigo-600"
                                                    )}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M20 6 9 17l-5-5" />
                                                        </svg>
                                                    </div>

                                                    <span className={cn(
                                                        "text-base",
                                                        isDark ? "text-zinc-300" : "text-zinc-700"
                                                    )}>
                                                        Benefício deste recurso {item}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Feature image */}
                                    <div className="lg:w-1/2">
                                        <div className={cn(
                                            "rounded-2xl overflow-hidden border shadow-xl",
                                            isDark ? "border-gray-800" : "border-gray-200"
                                        )}>
                                            <div className="aspect-video bg-gray-800/50 flex items-center justify-center">
                                                <div className="text-9xl">👨‍💻</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA section */}
                <section className="py-20 px-4 relative overflow-hidden">
                    <div className={cn(
                        "max-w-7xl mx-auto rounded-3xl p-12 md:p-16 relative overflow-hidden",
                        isDark
                            ? "bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-800/50"
                            : "bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/50"
                    )}>
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_rgba(109,40,217,0.15),_transparent_50%)]"></div>
                            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
                        </div>

                        <div className="relative z-10 text-center max-w-3xl mx-auto">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                className="text-3xl md:text-4xl font-bold mb-6"
                            >
                                Pronto para transformar sua forma de <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">aprender idiomas</span>?
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                viewport={{ once: true }}
                                className={cn(
                                    "text-lg mb-10",
                                    isDark ? "text-zinc-300" : "text-zinc-700"
                                )}
                            >
                                Junte-se a milhares de estudantes que já estão expandindo seus horizontes linguísticos com o WordPanda
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                <Link href="/register">
                                    <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium shadow-lg hover:shadow-indigo-500/20 dark:hover:shadow-indigo-400/20 transform hover:-translate-y-1 transition-all duration-300">
                                        Comece Sua Jornada Agora
                                    </button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </main>

            <MarketingFooter />
        </div>
    );
}
