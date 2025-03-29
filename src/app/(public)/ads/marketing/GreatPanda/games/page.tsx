'use client';

import { ROUTES } from '@/src/containers/constants/ROUTES';
import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { MarketingFooter } from '../components/MarketingFooter';
import { MarketingHeader } from '../components/MarketingHeader';

export default function GamesPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const games = [
        {
            title: "Spelling Bee",
            description: "Teste sua ortografia e pronúncia com este desafio de soletrar palavras em um novo idioma, recebendo feedback instantâneo.",
            icon: "🐝",
            color: "from-amber-500 to-yellow-500",
            features: [
                "Reconhecimento de pronúncia",
                "Dicas contextuais",
                "Diferentes níveis de dificuldade"
            ]
        },
        {
            title: "Word Association",
            description: "Conecte palavras relacionadas para construir redes semânticas e fortalecer seu vocabulário, entendendo como os conceitos se relacionam.",
            icon: "🔄",
            color: "from-indigo-500 to-blue-500",
            features: [
                "Mapas de relacionamento de palavras",
                "Aprendizado contextual",
                "Criação de redes semânticas"
            ]
        },
        {
            title: "Word Categories",
            description: "Organize palavras em suas categorias correspondentes para melhorar seu entendimento de campos semânticos e classificações.",
            icon: "📊",
            color: "from-emerald-500 to-green-500",
            features: [
                "Campos semânticos",
                "Organização de vocabulário",
                "Aprendizado por categorias"
            ]
        },
        {
            title: "Word Scramble",
            description: "Reorganize letras embaralhadas para formar palavras corretas, melhorando seu reconhecimento de padrões e ortografia.",
            icon: "🔡",
            color: "from-rose-500 to-pink-500",
            features: [
                "Contra o relógio",
                "Pistas visuais",
                "Dicas progressivas"
            ]
        },
        {
            title: "Memory Match",
            description: "Encontre pares de palavras e suas traduções ou definições em um jogo de memória que fortalece a retenção de vocabulário.",
            icon: "🧠",
            color: "from-purple-500 to-violet-500",
            features: [
                "Pareamento de palavras e significados",
                "Reforço de memória visual",
                "Competição com outros jogadores"
            ]
        },
        {
            title: "Sentence Builder",
            description: "Construa frases gramaticalmente corretas a partir de palavras avulsas, aprendendo estruturas e regras de maneira prática.",
            icon: "📝",
            color: "from-cyan-500 to-sky-500",
            features: [
                "Prática de sintaxe",
                "Regras gramaticais em contexto",
                "Construção progressiva de complexidade"
            ]
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
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            )}
                        >
                            Aprendizado Gamificado
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6"
                        >
                            Aprenda idiomas <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">jogando</span>
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
                            Nossos jogos educativos transformam o aprendizado em uma experiência divertida e envolvente, mantendo você motivado e acelerando seu progresso
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link href="/register">
                                <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium shadow-lg hover:shadow-emerald-500/20 dark:hover:shadow-emerald-400/20 transform hover:-translate-y-1 transition-all duration-300">
                                    Comece a Jogar
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

                {/* Games grid */}
                <section className="py-20 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {games.map((game, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -10 }}
                                    className={cn(
                                        "rounded-2xl p-8 border relative overflow-hidden",
                                        isDark
                                            ? "bg-gray-900/50 backdrop-blur-sm border-gray-800/60"
                                            : "bg-white backdrop-blur-sm border-gray-200/60 shadow-xl shadow-gray-200/20"
                                    )}
                                >
                                    <div className={cn(
                                        `absolute -right-10 -top-10 w-32 h-32 rounded-full bg-gradient-to-br ${game.color} opacity-20 blur-2xl`
                                    )}></div>

                                    <div className="relative">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className={cn(
                                                `w-16 h-16 rounded-xl flex items-center justify-center text-4xl`
                                            )}>
                                                {game.icon}
                                            </div>

                                            <div className={cn(
                                                "px-3 py-1 rounded-full text-xs font-medium",
                                                isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-700"
                                            )}>
                                                Divertido & Educativo
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-bold mb-3">{game.title}</h3>

                                        <p className={cn(
                                            "mb-6",
                                            isDark ? "text-zinc-400" : "text-zinc-600"
                                        )}>
                                            {game.description}
                                        </p>

                                        <div className="space-y-2 mb-8">
                                            {game.features.map((feature, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <div className={cn(
                                                        "w-4 h-4 rounded-full flex items-center justify-center",
                                                        isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-600"
                                                    )}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M20 6 9 17l-5-5" />
                                                        </svg>
                                                    </div>

                                                    <span className={cn(
                                                        "text-sm",
                                                        isDark ? "text-zinc-300" : "text-zinc-700"
                                                    )}>
                                                        {feature}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <Link href="/marketing/interactive-demo">
                                            <button className={cn(
                                                "w-full py-3 rounded-xl font-medium transition-all duration-300",
                                                isDark
                                                    ? "bg-white/10 hover:bg-white/20 text-white"
                                                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                                            )}>
                                                Experimentar
                                            </button>
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How it works */}
                <section className="py-20 px-4 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <div className={cn(
                                "inline-block px-4 py-1 rounded-full text-sm font-medium mb-4",
                                isDark
                                    ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                                    : "bg-sky-50 text-sky-700 border border-sky-100"
                            )}>
                                Como Funciona
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Neurociência + Gamificação = <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-cyan-500">Aprendizado Eficiente</span>
                            </h2>

                            <p className={cn(
                                "max-w-3xl mx-auto text-lg",
                                isDark ? "text-zinc-300" : "text-zinc-700"
                            )}>
                                Nossos jogos educativos são baseados em princípios de neurociência e psicologia cognitiva para maximizar a retenção e transferência de conhecimento
                            </p>
                        </motion.div>

                        <div className="relative">
                            <div className={cn(
                                "h-1 w-full absolute top-12 left-0 z-0",
                                isDark ? "bg-gray-800" : "bg-gray-200"
                            )}></div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                                {[
                                    {
                                        step: 1,
                                        title: "Engajamento Ativo",
                                        description: "Nossos jogos mantêm você ativamente envolvido, o que está comprovado cientificamente que melhora a retenção em até 90% comparado ao aprendizado passivo.",
                                        color: "emerald"
                                    },
                                    {
                                        step: 2,
                                        title: "Repetição Espaçada",
                                        description: "Utilizamos algoritmos de repetição espaçada para apresentar o conteúdo no momento ideal antes que você o esqueça, fortalecendo as conexões neurais.",
                                        color: "blue"
                                    },
                                    {
                                        step: 3,
                                        title: "Recompensas Dopaminérgicas",
                                        description: "Sistema de recompensas que libera dopamina no cérebro, criando ciclos de motivação positiva e transformando o aprendizado em um hábito prazeroso.",
                                        color: "amber"
                                    }
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.2 }}
                                        viewport={{ once: true }}
                                        className="flex flex-col items-center text-center"
                                    >
                                        <div className={cn(
                                            "w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold mb-6",
                                            isDark ? "bg-gray-900 border-2 border-gray-800" : "bg-white border-2 border-gray-200",
                                            item.color === "emerald" ? "text-emerald-500" :
                                                item.color === "blue" ? "text-blue-500" :
                                                    "text-amber-500"
                                        )}>
                                            {item.step}
                                        </div>

                                        <h3 className="text-xl font-bold mb-3">{item.title}</h3>

                                        <p className={cn(
                                            "text-sm",
                                            isDark ? "text-zinc-400" : "text-zinc-600"
                                        )}>
                                            {item.description}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA section */}
                <section className="py-20 px-4 relative overflow-hidden">
                    <div className={cn(
                        "max-w-7xl mx-auto rounded-3xl p-12 md:p-16 relative overflow-hidden",
                        isDark
                            ? "bg-gradient-to-br from-emerald-900/50 to-cyan-900/50 border border-emerald-800/50"
                            : "bg-gradient-to-br from-emerald-50 to-cyan-50 border border-emerald-100/50"
                    )}>
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.15),_transparent_50%)]"></div>
                            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
                        </div>

                        <div className="relative z-10 text-center max-w-3xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                className="text-6xl mb-6 mx-auto"
                            >
                                🎮
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                viewport={{ once: true }}
                                className="text-3xl md:text-4xl font-bold mb-6"
                            >
                                Pronto para tornar o aprendizado de idiomas <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">divertido</span>?
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                viewport={{ once: true }}
                                className={cn(
                                    "text-lg mb-10",
                                    isDark ? "text-zinc-300" : "text-zinc-700"
                                )}
                            >
                                Pare de procrastinar seu aprendizado de idiomas. Com o WordPanda, você vai querer estudar todos os dias!
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                viewport={{ once: true }}
                            >
                                <Link href={ROUTES.REGISTER()}>
                                    <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium shadow-lg hover:shadow-emerald-500/20 dark:hover:shadow-emerald-400/20 transform hover:-translate-y-1 transition-all duration-300">
                                        Começar a Jogar Agora
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
