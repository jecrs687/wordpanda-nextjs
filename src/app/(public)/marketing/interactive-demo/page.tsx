'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useState } from 'react';
import { MarketingFooter } from '../components/MarketingFooter';
import { MarketingHeader } from '../components/MarketingHeader';
import { DemoContent } from './components/DemoContent';

export default function InteractiveDemoPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [step, setStep] = useState(1);

    const steps = [
        { title: "Escolha seu idioma", description: "Selecione o idioma que deseja aprender" },
        { title: "Defina suas metas", description: "Escolha seu nível atual e objetivos de aprendizado" },
        { title: "Experimente os recursos", description: "Teste nossa metodologia e recursos interativos" },
        { title: "Acompanhe seu progresso", description: "Veja como o WordPanda ajuda você a evoluir" }
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
                <section className="relative py-16 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className={cn(
                                "inline-block px-4 py-1 rounded-full text-sm font-medium mb-6",
                                isDark
                                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                                    : "bg-cyan-50 text-cyan-700 border border-cyan-100"
                            )}
                        >
                            Demonstração Interativa
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6"
                        >
                            Experimente o <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-500">WordPanda</span> agora
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
                            Explore as principais funcionalidades da nossa plataforma nesta demonstração interativa e descubra como o WordPanda transforma o aprendizado de idiomas
                        </motion.p>
                    </div>
                </section>

                {/* Demo section */}
                <section className="py-10 px-4 relative">
                    <div className="max-w-7xl mx-auto">
                        {/* Progress steps */}
                        <div className="max-w-4xl mx-auto mb-10">
                            <div className="flex items-center justify-between mb-8">
                                {steps.map((s, i) => (
                                    <div key={i} className="flex flex-col items-center relative">
                                        <button
                                            onClick={() => setStep(i + 1)}
                                            className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center font-semibold z-10 transition-all duration-300",
                                                step > i + 1 ?
                                                    (isDark ? "bg-cyan-500 text-white" : "bg-cyan-500 text-white") :
                                                    step === i + 1 ?
                                                        (isDark ? "bg-cyan-500 text-white ring-4 ring-cyan-500/20" : "bg-cyan-500 text-white ring-4 ring-cyan-500/20") :
                                                        (isDark ? "bg-gray-800 text-gray-400" : "bg-gray-200 text-gray-500")
                                            )}
                                        >
                                            {step > i + 1 ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M20 6 9 17l-5-5" />
                                                </svg>
                                            ) : (
                                                i + 1
                                            )}
                                        </button>

                                        <div className={cn(
                                            "absolute top-5 -left-1/2 w-full h-0.5",
                                            i === 0 ? "hidden" : "block",
                                            step > i + 1 ?
                                                (isDark ? "bg-cyan-500" : "bg-cyan-500") :
                                                (isDark ? "bg-gray-800" : "bg-gray-200")
                                        )}></div>

                                        <div className="text-center mt-3">
                                            <h3 className={cn(
                                                "text-sm font-semibold",
                                                step >= i + 1 ?
                                                    (isDark ? "text-white" : "text-gray-900") :
                                                    (isDark ? "text-gray-400" : "text-gray-500")
                                            )}>
                                                {s.title}
                                            </h3>
                                            <p className={cn(
                                                "text-xs mt-1 hidden md:block",
                                                isDark ? "text-gray-400" : "text-gray-500"
                                            )}>
                                                {s.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Demo content */}
                        <div className={cn(
                            "relative overflow-hidden rounded-2xl border backdrop-blur-sm p-6 md:p-10",
                            isDark
                                ? "bg-gray-900/60 border-gray-800/60"
                                : "bg-white/80 border-gray-200/60 shadow-xl shadow-gray-200/20"
                        )}>
                            <DemoContent step={step} setStep={setStep} />
                        </div>
                    </div>
                </section>

                {/* CTA section */}
                <section className="py-20 px-4 relative overflow-hidden">
                    <div className={cn(
                        "max-w-7xl mx-auto rounded-3xl p-12 md:p-16 relative overflow-hidden",
                        isDark
                            ? "bg-gradient-to-br from-cyan-900/50 to-blue-900/50 border border-cyan-800/50"
                            : "bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100/50"
                    )}>
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.15),_transparent_50%)]"></div>
                            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
                        </div>

                        <div className="relative z-10 text-center max-w-3xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                className="text-6xl mb-6 mx-auto"
                            >
                                🚀
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                viewport={{ once: true }}
                                className="text-3xl md:text-4xl font-bold mb-6"
                            >
                                Gostou da experiência? <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-500">Cadastre-se</span> agora
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
                                O que você experimentou aqui é apenas uma pequena amostra do potencial completo da plataforma. Crie sua conta e transforme seu aprendizado de idiomas!
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                viewport={{ once: true }}
                                className="flex flex-col sm:flex-row gap-4 justify-center"
                            >
                                <Link href="/register">
                                    <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium shadow-lg hover:shadow-cyan-500/20 dark:hover:shadow-cyan-400/20 transform hover:-translate-y-1 transition-all duration-300">
                                        Criar Conta Gratuita
                                    </button>
                                </Link>
                                <Link href="/marketing/features">
                                    <button className={`px-8 py-4 rounded-xl font-medium shadow-md ${isDark
                                        ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm'
                                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                                        } transform hover:-translate-y-1 transition-all duration-300`}>
                                        Conhecer Recursos
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
