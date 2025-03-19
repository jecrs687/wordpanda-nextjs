"use client";

import { motion } from 'framer-motion';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

export default function GamesLayout({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-h-screen"
            >
                {children}
            </motion.div>
        </ThemeProvider>
    );
}
