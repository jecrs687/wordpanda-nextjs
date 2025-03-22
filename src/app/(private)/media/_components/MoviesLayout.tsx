"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function MoviesLayout({ children }: { children: ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-br from-white via-zinc-50 to-sky-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
        >
            {children}
        </motion.div>
    );
}
