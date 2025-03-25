"use client";

import { motion } from "framer-motion";

interface PandaHeaderProps {
    condensed?: boolean;
}

export default function PandaHeader({ condensed = false }: PandaHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
        >
            <div className="flex items-center justify-center w-10 h-10 bg-black dark:bg-white rounded-full overflow-hidden">
                <div className="relative w-full h-full">
                    {/* Panda face */}
                    <div className="absolute inset-0 bg-white dark:bg-black rounded-full scale-90" />
                    <div className="absolute top-1 left-1.5 w-2 h-2 bg-black dark:bg-white rounded-full" />
                    <div className="absolute top-1 right-1.5 w-2 h-2 bg-black dark:bg-white rounded-full" />
                    <div className="absolute bottom-2 inset-x-0 mx-auto w-3 h-1.5 bg-black dark:bg-white rounded-full" />
                </div>
            </div>

            {!condensed && (
                <>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        Learning <span className="text-emerald-500">Metrics</span>
                    </h1>
                    <div className="hidden md:block h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>
                    <p className="hidden md:block text-gray-600 dark:text-gray-300 text-sm">
                        Track progress and optimize your learning
                    </p>
                </>
            )}

            {condensed && (
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                    Metrics
                </h1>
            )}
        </motion.div>
    );
}
