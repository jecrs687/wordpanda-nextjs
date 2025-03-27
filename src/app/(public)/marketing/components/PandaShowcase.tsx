'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

export const PandaShowcase = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <section className="py-20 px-4 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Panda animation */}
                    <motion.div
                        className="lg:w-1/2 flex justify-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="relative w-72 h-72 sm:w-96 sm:h-96">
                            {/* Background circle */}
                            <motion.div
                                className={cn(
                                    "absolute inset-0 rounded-full",
                                    isDark ? "bg-gray-800" : "bg-gray-100"
                                )}
                                animate={{
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                }}
                            />

                            {/* Panda body */}
                            <motion.div
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white dark:bg-white rounded-[40%] z-10"
                                animate={{
                                    y: [0, -10, 0],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                }}
                            />

                            {/* Panda head */}
                            <motion.div
                                className="absolute top-[20%] left-1/2 transform -translate-x-1/2 w-2/3 h-2/3 bg-white dark:bg-white rounded-full z-20 overflow-visible"
                                animate={{
                                    y: [0, -5, 0],
                                    rotate: [0, 5, 0, -5, 0],
                                }}
                                transition={{
                                    y: {
                                        duration: 4,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                    },
                                    rotate: {
                                        duration: 10,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                    }
                                }}
                            >
                                {/* Panda left ear */}
                                <motion.div
                                    className="absolute -top-5 -left-5 w-10 h-10 sm:w-12 sm:h-12 bg-black dark:bg-gray-900 rounded-full"
                                    animate={{
                                        rotate: [0, 5, 0],
                                    }}
                                    transition={{
                                        duration: 5,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                    }}
                                />

                                {/* Panda right ear */}
                                <motion.div
                                    className="absolute -top-5 -right-5 w-10 h-10 sm:w-12 sm:h-12 bg-black dark:bg-gray-900 rounded-full"
                                    animate={{
                                        rotate: [0, -5, 0],
                                    }}
                                    transition={{
                                        duration: 5,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                    }}
                                />

                                {/* Panda eyes */}
                                <div className="relative h-full">
                                    {/* Left eye patch */}
                                    <div className="absolute top-[30%] left-[20%] w-[30%] h-[25%] bg-black dark:bg-gray-900 rounded-full transform -rotate-12"></div>

                                    {/* Right eye patch */}
                                    <div className="absolute top-[30%] right-[20%] w-[30%] h-[25%] bg-black dark:bg-gray-900 rounded-full transform rotate-12"></div>

                                    {/* Left eye */}
                                    <motion.div
                                        className="absolute top-[38%] left-[35%] w-[8%] h-[8%] bg-white dark:bg-white rounded-full"
                                        animate={{
                                            y: [0, 1, 0, -1, 0],
                                            x: [0, 1, 0, -1, 0],
                                        }}
                                        transition={{
                                            duration: 5,
                                            repeat: Infinity,
                                            repeatType: "mirror",
                                        }}
                                    />

                                    {/* Right eye */}
                                    <motion.div
                                        className="absolute top-[38%] right-[35%] w-[8%] h-[8%] bg-white dark:bg-white rounded-full"
                                        animate={{
                                            y: [0, 1, 0, -1, 0],
                                            x: [0, 1, 0, -1, 0],
                                        }}
                                        transition={{
                                            duration: 5,
                                            repeat: Infinity,
                                            repeatType: "mirror",
                                        }}
                                    />

                                    {/* Nose */}
                                    <motion.div
                                        className="absolute top-[55%] left-1/2 transform -translate-x-1/2 w-[15%] h-[10%] bg-black dark:bg-gray-900 rounded-full"
                                        animate={{
                                            scale: [1, 1.1, 1],
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                        }}
                                    />

                                    {/* Mouth */}
                                    <motion.div
                                        className="absolute top-[68%] left-1/2 transform -translate-x-1/2 w-[10%] h-[5%] bg-black dark:bg-gray-900 rounded-full"
                                        animate={{
                                            width: ["10%", "15%", "10%"],
                                        }}
                                        transition={{
                                            duration: 5,
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                        }}
                                    />
                                </div>
                            </motion.div>

                            {/* Bamboo in hand */}
                            <motion.div
                                className="absolute bottom-[15%] right-[10%] z-20"
                                animate={{
                                    rotate: [0, 5, 0, -5, 0],
                                    y: [0, -5, 0],
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                }}
                            >
                                <div className="w-4 h-24 bg-emerald-500 dark:bg-emerald-400 rounded-full"></div>
                                <div className="absolute top-0 left-0 w-10 h-4 bg-emerald-400 dark:bg-emerald-300 rounded-full transform -translate-x-1/2 -rotate-45"></div>
                                <div className="absolute top-1/4 right-0 w-10 h-4 bg-emerald-400 dark:bg-emerald-300 rounded-full transform translate-x-1/2 rotate-45"></div>
                            </motion.div>

                            {/* Left paw */}
                            <motion.div
                                className="absolute bottom-[25%] left-[25%] w-[15%] h-[15%] bg-white dark:bg-white rounded-full z-0"
                                animate={{
                                    y: [0, 5, 0],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    delay: 1,
                                }}
                            />

                            {/* Right paw holding bamboo */}
                            <motion.div
                                className="absolute bottom-[20%] right-[25%] w-[15%] h-[15%] bg-white dark:bg-white rounded-full z-30"
                                animate={{
                                    y: [0, -5, 0],
                                    rotate: [0, 5, 0],
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                }}
                            />

                            {/* Chinese characters bubble */}
                            <motion.div
                                className={cn(
                                    "absolute top-[15%] left-[8%] px-4 py-2 rounded-xl text-sm font-bold z-30",
                                    isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900 shadow-lg"
                                )}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: [0, -5, 0],
                                }}
                                transition={{
                                    y: {
                                        duration: 3,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                    },
                                    opacity: {
                                        delay: 1,
                                        duration: 0.5,
                                    },
                                    scale: {
                                        delay: 1,
                                        duration: 0.5,
                                    }
                                }}
                            >
                                你好！
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Content */}
                    <div className="lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className={cn(
                                "inline-block px-4 py-1 rounded-full text-sm font-medium mb-4",
                                isDark
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            )}
                        >
                            Aprendizado Natural
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-bold mb-6"
                        >
                            Como um panda adora bambu, seu cérebro adora <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">aprender</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                            className={cn(
                                "text-lg mb-8",
                                isDark ? "text-zinc-300" : "text-zinc-700"
                            )}
                        >
                            Nosso método foi projetado para trabalhar com os processos naturais do seu cérebro. Assim como um panda devora bambu sem esforço, você absorverá um novo idioma naturalmente, sem a frustração da memorização forçada.
                        </motion.p>

                        <div className="space-y-6">
                            {[
                                {
                                    title: "Imersão Contextual",
                                    description: "Aprenda palavras e expressões em contextos reais, não isoladamente.",
                                    color: "emerald"
                                },
                                {
                                    title: "Repetição Espaçada",
                                    description: "Nossa tecnologia identifica quando você precisa revisar, evitando esquecimentos.",
                                    color: "indigo"
                                },
                                {
                                    title: "Aprendizado Multimodal",
                                    description: "Combine áudio, visual e escrita para fortalecer as conexões neurais.",
                                    color: "amber"
                                }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                                    viewport={{ once: true }}
                                    className="flex items-start gap-4"
                                >
                                    <div className={cn(
                                        "mt-1 w-8 h-8 flex items-center justify-center rounded-lg shrink-0",
                                        item.color === "emerald" ? (isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-600") :
                                            item.color === "indigo" ? (isDark ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-100 text-indigo-600") :
                                                (isDark ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-600")
                                    )}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
                                            <path d="M20 6 9 17l-5-5" />
                                        </svg>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                                        <p className={cn(
                                            "text-sm",
                                            isDark ? "text-zinc-400" : "text-zinc-600"
                                        )}>
                                            {item.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
