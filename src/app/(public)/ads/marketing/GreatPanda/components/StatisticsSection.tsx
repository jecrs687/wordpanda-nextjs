'use client';

import { cn } from '@utils/utils';
import { motion, useInView } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

type StatItemProps = {
    value: number;
    symbol?: string;
    label: string;
    color: string;
    delay?: number;
};

const StatItem = ({ value, symbol = '', label, color, delay = 0 }: StatItemProps) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (inView) {
            let start = 0;
            const end = value;
            const duration = 2000;
            const increment = end / (duration / 16);

            setTimeout(() => {
                const timer = setInterval(() => {
                    start += increment;
                    if (start > end) {
                        setCount(end);
                        clearInterval(timer);
                    } else {
                        setCount(Math.floor(start));
                    }
                }, 16);

                return () => clearInterval(timer);
            }, delay);
        }
    }, [inView, value, delay]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: delay / 1000 }}
            className={cn(
                "flex flex-col items-center p-6 rounded-xl border",
                isDark
                    ? "bg-gray-900/50 backdrop-blur-sm border-gray-800/60"
                    : "bg-white backdrop-blur-sm border-gray-200/60",
            )}
        >
            <div className={cn(
                "text-4xl sm:text-5xl font-bold mb-2",
                color === "emerald" ? "text-emerald-500 dark:text-emerald-400" :
                    color === "indigo" ? "text-indigo-500 dark:text-indigo-400" :
                        color === "amber" ? "text-amber-500 dark:text-amber-400" :
                            "text-sky-500 dark:text-sky-400"
            )}>
                {count}{symbol}
            </div>
            <p className={cn(
                "text-sm sm:text-base text-center",
                isDark ? "text-zinc-400" : "text-zinc-600"
            )}>
                {label}
            </p>
        </motion.div>
    );
};

export const StatisticsSection = () => {
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
                                ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                                : "bg-sky-50 text-sky-700 border border-sky-100"
                        )}
                    >
                        Números Impressionantes
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold mb-6"
                    >
                        Transformando a educação de <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-cyan-500">idiomas</span>
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
                        Junte-se à milhares de estudantes que já estão expandindo seus horizontes linguísticos com o WordPanda
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <StatItem
                        value={10000}
                        symbol="+"
                        label="Estudantes Ativos"
                        color="emerald"
                    />
                    <StatItem
                        value={30}
                        label="Idiomas Disponíveis"
                        color="indigo"
                        delay={200}
                    />
                    <StatItem
                        value={5000000}
                        symbol="+"
                        label="Palavras Aprendidas"
                        color="amber"
                        delay={400}
                    />
                    <StatItem
                        value={98}
                        symbol="%"
                        label="Taxa de Satisfação"
                        color="sky"
                        delay={600}
                    />
                </div>

                {/* Background decoration */}
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/3 h-1/2 bg-gradient-to-l from-sky-500/5 to-transparent rounded-l-full blur-3xl -z-10"></div>
                <div className="absolute top-1/4 left-0 w-1/4 h-1/3 bg-gradient-to-r from-emerald-500/5 to-transparent rounded-r-full blur-3xl -z-10"></div>
            </div>
        </section>
    );
};
