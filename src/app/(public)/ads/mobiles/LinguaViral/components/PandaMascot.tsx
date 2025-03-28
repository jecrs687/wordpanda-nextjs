'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { Award, Flame, Trophy } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function PandaMascot() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = theme === 'dark';

    return (
        <section className="py-20 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    {/* Animated Panda */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                        className="relative md:w-1/2 flex justify-center"
                    >
                        <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                            {/* Background */}
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

                                    {/* Mouth - Smiling for viral theme */}
                                    <motion.div
                                        className="absolute top-[68%] left-1/2 transform -translate-x-1/2 w-[30%] h-[10%] border-b-4 rounded-b-xl"
                                        initial={{ borderColor: "#000" }}
                                        animate={{
                                            width: ["30%", "35%", "30%"],
                                        }}
                                        transition={{
                                            duration: 5,
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                        }}
                                        style={{ borderColor: isDark ? "#1f2937" : "#000" }}
                                    />
                                </div>
                            </motion.div>

                            {/* Trophy/Award in hand */}
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
                                <div className={cn(
                                    "w-10 h-10 flex items-center justify-center rounded-full",
                                    isDark ? "bg-yellow-500/80 text-gray-900" : "bg-yellow-500 text-white"
                                )}>
                                    <Trophy className="w-6 h-6" />
                                </div>
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

                            {/* Right paw holding trophy */}
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

                            {/* Emojis around panda - Viral theme */}
                            <motion.div
                                className="absolute -top-4 right-0 z-30 text-xl"
                                animate={{
                                    y: [0, -10, 0],
                                    rotate: [0, 10, 0],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    delay: 0.5,
                                }}
                            >
                                🏆
                            </motion.div>

                            <motion.div
                                className="absolute top-1/4 -left-4 z-30 text-xl"
                                animate={{
                                    y: [0, -8, 0],
                                    rotate: [0, -10, 0],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    delay: 1,
                                }}
                            >
                                🔥
                            </motion.div>

                            <motion.div
                                className="absolute bottom-1/4 -right-2 z-30 text-xl"
                                animate={{
                                    y: [0, -6, 0],
                                    rotate: [0, 5, 0],
                                }}
                                transition={{
                                    duration: 3.5,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    delay: 1.5,
                                }}
                            >
                                ⭐
                            </motion.div>

                            {/* Rewards bubble */}
                            <motion.div
                                className={cn(
                                    "absolute -top-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl text-sm font-bold z-30",
                                    isDark ? "bg-purple-500/30 text-white border border-purple-500/30" : "bg-purple-100 text-purple-900 border border-purple-200 shadow-md"
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
                                Vamos viralizar! 🚀
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Content */}
                    <div className="md:w-1/2 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className={cn(
                                "inline-block px-4 py-1 rounded-full text-sm font-medium mb-4",
                                isDark
                                    ? "bg-pink-500/10 text-pink-400 border border-pink-500/20"
                                    : "bg-pink-50 text-pink-700 border border-pink-100"
                            )}
                        >
                            Conheça o PandaTrending
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-bold mb-6"
                        >
                            Seu companheiro para{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                                viralizar
                            </span>{' '}
                            no aprendizado
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
                            O PandaTrending é seu guia pessoal que transforma o aprendizado de idiomas em uma jornada viral. Ele te ajuda a manter a motivação com desafios diários, celebra suas conquistas e conecta você com a comunidade global.
                        </motion.p>

                        <div className="space-y-6">
                            {[
                                {
                                    title: "Recompensas Diárias",
                                    description: "Receba prêmios exclusivos por manter sua sequência de estudo diária.",
                                    icon: <Award className="w-5 h-5" />,
                                    color: "yellow"
                                },
                                {
                                    title: "Competição Amigável",
                                    description: "Compare seu progresso com amigos e outros estudantes do seu nível.",
                                    icon: <Trophy className="w-5 h-5" />,
                                    color: "purple"
                                },
                                {
                                    title: "Streaks Motivadores",
                                    description: "Mantenha sua chama acesa com sequências que aumentam suas recompensas.",
                                    icon: <Flame className="w-5 h-5" />,
                                    color: "orange"
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
                                        "mt-1 w-10 h-10 flex items-center justify-center rounded-lg shrink-0",
                                        item.color === "yellow" ?
                                            (isDark ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-100 text-yellow-600") :
                                            item.color === "purple" ?
                                                (isDark ? "bg-purple-500/20 text-purple-400" : "bg-purple-100 text-purple-600") :
                                                (isDark ? "bg-orange-500/20 text-orange-400" : "bg-orange-100 text-orange-600")
                                    )}>
                                        {item.icon}
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
}
