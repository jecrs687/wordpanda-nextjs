"use client";

import { motion } from "framer-motion";

export default function MetricsLoading() {
    return (
        <div className="container mx-auto px-4 py-10 flex flex-col items-center justify-center min-h-[60vh]">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
            >
                <div className="relative w-24 h-24 mb-6">
                    {/* Panda face animation */}
                    <motion.div
                        className="w-full h-full bg-white dark:bg-black rounded-full"
                        animate={{ scale: [0.9, 1, 0.9] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    />

                    {/* Panda eyes */}
                    <motion.div
                        className="absolute top-6 left-5 w-4 h-4 bg-black dark:bg-white rounded-full"
                        animate={{ scaleY: [1, 0.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.1 }}
                    />
                    <motion.div
                        className="absolute top-6 right-5 w-4 h-4 bg-black dark:bg-white rounded-full"
                        animate={{ scaleY: [1, 0.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.1 }}
                    />

                    {/* Panda nose/mouth */}
                    <motion.div
                        className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-5 h-3 bg-black dark:bg-white rounded-full"
                        animate={{ scaleX: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    />
                </div>

                <motion.h2
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="text-xl font-bold text-gray-800 dark:text-white mb-2"
                >
                    Loading your metrics...
                </motion.h2>

                <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                    Bamboo takes time to grow, and so does great data visualization
                </p>

                <div className="mt-6 flex justify-center space-x-2">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2.5 h-2.5 bg-emerald-500 rounded-full"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                repeatType: "loop",
                                delay: i * 0.2,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
