'use client';

import { cn } from '@utils/utils';
import { motion, useAnimation } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function MascotInteraction() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const controls = useAnimation();
    const speechControls = useAnimation();
    const [messageIndex, setMessageIndex] = useState(0);

    const messages = [
        "Vamos aprender juntos?",
        "Estou com fome de palavras novas!",
        "Filmes + Aprendizado = Diversão!",
        "Pronto para começar?",
        "Seu parceiro de estudos!"
    ];

    useEffect(() => {
        // Panda animation
        controls.start({
            y: [0, -10, 0],
            transition: {
                repeat: Infinity,
                repeatType: "reverse",
                duration: 2.5,
                ease: "easeInOut"
            }
        });

        // Speech bubble animation
        const rotateSpeechBubbles = async () => {
            while (true) {
                await speechControls.start({ opacity: 1, scale: 1, y: 0 });
                await new Promise(resolve => setTimeout(resolve, 2500));
                await speechControls.start({ opacity: 0, scale: 0.9, y: 10 });
                setMessageIndex(prev => (prev + 1) % messages.length);
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        };

        rotateSpeechBubbles();
    }, [controls, speechControls, messages.length]);

    return (
        <section className="py-10">
            <div className="flex flex-col items-center">
                <motion.div
                    className="relative"
                    animate={controls}
                >
                    {/* Speech bubble */}
                    <motion.div
                        className={cn(
                            "absolute -top-20 left-1/2 transform -translate-x-1/2 z-10",
                            "px-5 py-3 rounded-2xl",
                            "text-center max-w-[200px]",
                            "before:content-[''] before:absolute before:left-1/2 before:-bottom-2 before:-translate-x-1/2",
                            "before:w-4 before:h-4 before:rotate-45",
                            isDark
                                ? "bg-gray-800 text-white before:bg-gray-800"
                                : "bg-white text-gray-800 shadow-lg before:bg-white"
                        )}
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={speechControls}
                    >
                        {messages[messageIndex]}
                    </motion.div>

                    {/* Panda character */}
                    <div className="relative w-60 h-60">
                        {/* Panda head */}
                        <motion.div className="absolute w-40 h-40 bg-white rounded-full left-1/2 top-5 transform -translate-x-1/2 shadow-lg">
                            {/* Eyes */}
                            <div className="absolute top-12 left-8 w-10 h-10 bg-black rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-full relative right-1"></div>
                            </div>
                            <div className="absolute top-12 right-8 w-10 h-10 bg-black rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-full relative left-1"></div>
                            </div>

                            {/* Nose */}
                            <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-8 h-5 bg-black rounded-full"></div>

                            {/* Ears */}
                            <div className="absolute -top-6 -left-2 w-14 h-14 bg-black rounded-full"></div>
                            <div className="absolute -top-6 -right-2 w-14 h-14 bg-black rounded-full"></div>
                        </motion.div>

                        {/* Panda body */}
                        <motion.div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-32 bg-white rounded-3xl">
                            {/* Black patches */}
                            <div className="absolute top-0 left-3 w-16 h-16 bg-black rounded-full"></div>
                            <div className="absolute top-0 right-3 w-16 h-16 bg-black rounded-full"></div>

                            {/* Popcorn Bucket */}
                            <motion.div
                                className="absolute -right-12 top-4 w-20 h-16 bg-red-500 rounded-md flex items-center justify-center overflow-hidden"
                                initial={{ rotate: 0 }}
                                animate={{ rotate: [0, -5, 0, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                            >
                                <div className="absolute top-0 left-0 right-0 h-3 bg-white/20"></div>
                                <div className="absolute top-2 w-24 h-12 bg-yellow-100 rounded-t-full transform translate-y-5"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.span
                                        className="text-xs font-bold text-white"
                                        animate={{ opacity: [0.7, 1, 0.7] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                    >
                                        Palavras
                                    </motion.span>
                                </div>
                            </motion.div>

                            {/* Arm */}
                            <motion.div
                                className="absolute -right-4 top-8 w-8 h-16 bg-white rounded-full transform -rotate-45"
                                animate={{ rotate: [-45, -40, -45] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            />
                        </motion.div>
                    </div>
                </motion.div>

                <motion.h3
                    className="text-2xl font-bold mt-4 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Conheça o Panda
                </motion.h3>

                <motion.p
                    className="text-center mt-2 text-zinc-600 dark:text-zinc-400 max-w-sm"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    Seu parceiro de aprendizado que te acompanha em toda jornada! O Panda adora devorar palavras novas assim como você.
                </motion.p>
            </div>
        </section>
    );
}
