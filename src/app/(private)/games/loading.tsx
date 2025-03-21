"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function GamesLoading() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted ? theme === 'dark' : false;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-zinc-50 to-sky-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            <div className="text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-24 h-24 mx-auto mb-6"
                >
                    <Image
                        src={isDark ? "/assets/logo_white.png" : "/assets/logo.png"}
                        alt="WordPanda"
                        fill
                        className="object-contain"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <div className="relative h-2 w-48 mb-6 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                            initial={{ width: 0 }}
                            animate={{
                                width: ["0%", "100%"],
                                transition: {
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }
                            }}
                        />
                    </div>

                    <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        Carregando jogos...
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Preparando suas atividades de aprendizagem
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
