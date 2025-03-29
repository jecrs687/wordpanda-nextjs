"use client";
import { motion } from "framer-motion";

type DashboardHeaderProps = {
    title: string;
    description: string;
};

export default function DashboardHeader({ title, description }: DashboardHeaderProps) {
    return (
        <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
                <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
                    {title}
                </span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                {description}
            </p>
        </motion.div>
    );
}
