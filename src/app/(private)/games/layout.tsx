"use client";

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function GamesLayout({ children }: { children: ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen"
        >
            {children}
        </motion.div>
    );
}
