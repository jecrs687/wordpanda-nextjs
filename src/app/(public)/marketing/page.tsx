'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { HeroSection } from './components/HeroSection';
import { MarketingFeatures } from './components/MarketingFeatures';
import { MarketingFooter } from './components/MarketingFooter';
import { MarketingHeader } from './components/MarketingHeader';
import { PandaShowcase } from './components/PandaShowcase';
import { SocialProof } from './components/SocialProof';
import { StatisticsSection } from './components/StatisticsSection';

export default function MarketingPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

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

            <main className="relative">
                <HeroSection />
                <MarketingFeatures />
                <PandaShowcase />
                <StatisticsSection />
                <SocialProof />

                <section className="py-20 px-4 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto text-center">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-4xl md:text-5xl font-extrabold mb-6"
                        >
                            Pronto para começar sua <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">jornada linguística</span>?
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg md:text-xl max-w-3xl mx-auto mb-10 text-zinc-700 dark:text-zinc-300"
                        >
                            Junte-se a milhares de estudantes que estão transformando seu aprendizado de idiomas com WordPanda
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link href="/register">
                                <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium shadow-lg hover:shadow-emerald-500/20 dark:hover:shadow-emerald-400/20 transform hover:-translate-y-1 transition-all duration-300">
                                    Comece Gratuitamente
                                </button>
                            </Link>
                            <Link href="/marketing/features">
                                <button className={`px-8 py-4 rounded-xl font-medium shadow-md ${isDark
                                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm'
                                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                                    } transform hover:-translate-y-1 transition-all duration-300`}>
                                    Explore Recursos
                                </button>
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </main>

            <MarketingFooter />
        </div>
    );
}
