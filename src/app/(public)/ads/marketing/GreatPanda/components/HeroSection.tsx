'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Link from 'next/link';

export const HeroSection = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const floatingVariants = {
        animate: {
            y: [0, -10, 0],
            transition: {
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse" as const,
                ease: "easeInOut"
            }
        }
    };

    return (
        <section className="relative py-16 md:py-24 px-4 overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-emerald-500/10 dark:border-emerald-500/5 z-0"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-emerald-500/10 dark:border-emerald-500/5 z-0"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-emerald-500/10 dark:border-emerald-500/5 z-0"></div>

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    {/* Left side content */}
                    <motion.div
                        className="md:w-1/2 z-10"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants} className="mb-4">
                            <div className={cn(
                                "px-4 py-1 rounded-full text-sm inline-flex items-center gap-2 mb-6 w-auto",
                                isDark
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            )}>
                                <span className="relative flex h-2 w-2">
                                    <span className={cn(
                                        "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                                        isDark ? "bg-emerald-400" : "bg-emerald-500"
                                    )}></span>
                                    <span className={cn(
                                        "relative inline-flex rounded-full h-2 w-2",
                                        isDark ? "bg-emerald-400" : "bg-emerald-500"
                                    )}></span>
                                </span>
                                Nova versão disponível
                            </div>
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
                        >
                            Aprenda idiomas de forma{' '}
                            <span className="relative">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">divertida</span>
                                <motion.svg
                                    className={cn(
                                        "absolute -bottom-2 left-0 w-full",
                                        isDark ? "text-emerald-500" : "text-emerald-500"
                                    )}
                                    width="100%"
                                    height="8"
                                    viewBox="0 0 150 8"
                                    fill="none"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ delay: 1.5, duration: 1 }}
                                >
                                    <path
                                        d="M1 5.5C20 -0.5 50 -0.5 70 5.5C90 11.5 120 11.5 149 5.5"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                    />
                                </motion.svg>
                            </span>{' '}
                            e{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">eficiente</span>
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className={cn(
                                "text-lg md:text-xl mb-8 max-w-xl",
                                isDark ? "text-zinc-300" : "text-zinc-700"
                            )}
                        >
                            WordPanda transforma sua experiência de aprendizado com exercícios interativos, jogos envolventes e uma comunidade global de aprendizes. Estudar nunca foi tão natural.
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Link href="/register">
                                <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium shadow-lg hover:shadow-emerald-500/20 dark:hover:shadow-emerald-400/20 transform hover:-translate-y-1 transition-all duration-300">
                                    Comece Gratuitamente
                                </button>
                            </Link>
                            <Link href="/marketing/interactive-demo">
                                <button className={cn(
                                    "px-8 py-4 rounded-xl font-medium shadow-md transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2",
                                    isDark
                                        ? "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                                        : "bg-gray-900 hover:bg-gray-800 text-white"
                                )}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play">
                                        <polygon points="5 3 19 12 5 21 5 3" />
                                    </svg>
                                    Ver demonstração
                                </button>
                            </Link>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className={cn(
                                "flex items-center gap-4 mt-8",
                                isDark ? "text-zinc-400" : "text-zinc-600"
                            )}
                        >
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "w-8 h-8 rounded-full border-2",
                                            isDark ? "border-gray-900" : "border-white",
                                            `bg-gradient-to-br ${i === 1 ? "from-pink-500 to-purple-500" :
                                                i === 2 ? "from-blue-500 to-cyan-500" :
                                                    i === 3 ? "from-emerald-500 to-green-500" :
                                                        "from-amber-500 to-orange-500"
                                            }`
                                        )}
                                    ></div>
                                ))}
                            </div>
                            <p className="text-sm">
                                <span className="font-semibold">+10.000</span> estudantes ativos
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Right side image/illustration */}
                    <motion.div
                        className="md:w-1/2 flex justify-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                    >
                        <div className="relative w-full max-w-lg h-[500px]">
                            {/* Background shapes */}
                            <motion.div
                                className="absolute -right-4 -top-4 w-72 h-72 bg-emerald-400/20 dark:bg-emerald-600/10 rounded-full blur-3xl"
                                animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.4, 0.6, 0.4],
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                }}
                            />
                            <motion.div
                                className="absolute -left-10 bottom-10 w-72 h-72 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-3xl"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.5, 0.3],
                                }}
                                transition={{
                                    duration: 10,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    delay: 1,
                                }}
                            />

                            {/* Floating device mockup */}
                            <motion.div
                                className="relative z-10 perspective-1000"
                                variants={floatingVariants}
                                animate="animate"
                            >
                                <div className={cn(
                                    "relative p-3 rounded-[2.5rem] shadow-2xl w-full max-w-[320px] mx-auto overflow-hidden",
                                    isDark
                                        ? "bg-gray-800 border-4 border-gray-700"
                                        : "bg-white border-4 border-gray-200"
                                )}>
                                    <div className={cn(
                                        "absolute top-0 left-0 right-0 h-20 z-10 bg-gradient-to-b from-emerald-500 to-cyan-500"
                                    )}>
                                        <div className="absolute left-1/2 transform -translate-x-1/2 top-10 w-16 h-4 bg-black dark:bg-gray-900 rounded-b-xl"></div>
                                        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.5),_transparent_70%)]"></div>
                                    </div>

                                    <div className={cn(
                                        "relative rounded-2xl overflow-hidden h-[500px] bg-gradient-to-b",
                                        isDark
                                            ? "from-gray-900 to-gray-900"
                                            : "from-white to-gray-50"
                                    )}>
                                        <div className="pt-20 px-4">
                                            <div className="mb-6">
                                                <h3 className="text-lg font-bold mb-2">Olá, Aprendiz! 👋</h3>
                                                <div className={cn(
                                                    "h-2 rounded-full w-24 mb-4",
                                                    isDark ? "bg-gray-700" : "bg-gray-200"
                                                )}></div>
                                                <div className="flex gap-2">
                                                    <div className={cn(
                                                        "px-3 py-1 rounded-full text-sm font-medium",
                                                        isDark
                                                            ? "bg-emerald-500/20 text-emerald-400"
                                                            : "bg-emerald-100 text-emerald-600"
                                                    )}>
                                                        Espanhol
                                                    </div>
                                                    <div className={cn(
                                                        "px-3 py-1 rounded-full text-sm font-medium",
                                                        isDark
                                                            ? "bg-indigo-500/20 text-indigo-400"
                                                            : "bg-indigo-100 text-indigo-600"
                                                    )}>
                                                        Nível 3
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={cn(
                                                "rounded-xl p-4 mb-4",
                                                isDark ? "bg-gray-800" : "bg-white shadow-sm"
                                            )}>
                                                <div className="flex justify-between items-center mb-3">
                                                    <h4 className="font-medium">Progresso Diário</h4>
                                                    <span className={cn(
                                                        "text-sm font-medium",
                                                        isDark ? "text-emerald-400" : "text-emerald-600"
                                                    )}>75%</span>
                                                </div>
                                                <div className={cn(
                                                    "h-2 rounded-full overflow-hidden mb-2 w-full",
                                                    isDark ? "bg-gray-700" : "bg-gray-200"
                                                )}>
                                                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 w-3/4"></div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-3">
                                                {[
                                                    { color: "emerald", name: "Vocabulário" },
                                                    { color: "indigo", name: "Gramática" },
                                                    { color: "amber", name: "Conversação" }
                                                ].map((item, i) => (
                                                    <div
                                                        key={i}
                                                        className={cn(
                                                            "rounded-xl p-4 flex justify-between items-center",
                                                            isDark ? "bg-gray-800" : "bg-white shadow-sm"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={cn(
                                                                "w-10 h-10 rounded-lg flex items-center justify-center",
                                                                item.color === "emerald" ? (isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-600") :
                                                                    item.color === "indigo" ? (isDark ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-100 text-indigo-600") :
                                                                        (isDark ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-600")
                                                            )}>
                                                                {item.color === "emerald" ? "📚" : item.color === "indigo" ? "🖋️" : "💬"}
                                                            </div>
                                                            <span className="font-medium">{item.name}</span>
                                                        </div>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right">
                                                            <path d="m9 18 6-6-6-6" />
                                                        </svg>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating elements */}
                            <motion.div
                                className={cn(
                                    "absolute -top-10 -right-10 p-4 rounded-xl shadow-lg z-20",
                                    isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
                                )}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                                variants={floatingVariants}
                                custom={1}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                        🔥
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium">Sequência</div>
                                        <div className="text-lg font-bold">7 dias</div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                className={cn(
                                    "absolute -bottom-5 -left-5 p-4 rounded-xl shadow-lg z-20 max-w-[180px]",
                                    isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
                                )}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 }}
                                variants={floatingVariants}
                                custom={2}
                            >
                                <div className="flex flex-col">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="text-sm font-medium">Palavras aprendidas</div>
                                        <div className={cn(
                                            "text-xs font-medium px-2 py-0.5 rounded-full",
                                            isDark ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-100 text-indigo-600"
                                        )}>
                                            +15
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        {["P", "A", "N", "D", "A"].map((letter, i) => (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "w-7 h-7 flex items-center justify-center font-bold rounded text-sm",
                                                    isDark ? "bg-cyan-500/20 text-cyan-400" : "bg-cyan-100 text-cyan-600"
                                                )}
                                            >
                                                {letter}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
