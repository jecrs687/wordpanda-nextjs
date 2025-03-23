'use client';

import { motion } from 'framer-motion';
import React from 'react';

type GameContainerProps = {
    children: React.ReactNode;
    className?: string;
};

const GameContainer = ({ children, className = '' }: GameContainerProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`min-h-screen w-full bg-gradient-to-br from-white via-zinc-50 to-sky-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 ${className}`}
        >
            {/* Decorative elements */}
            <div className="fixed top-20 right-20 w-64 h-64 bg-emerald-400/5 dark:bg-emerald-400/10 rounded-full blur-3xl -z-10" />
            <div className="fixed bottom-40 left-20 w-80 h-80 bg-indigo-400/5 dark:bg-indigo-400/10 rounded-full blur-3xl -z-10" />
            <div className="fixed top-1/3 left-1/3 w-72 h-72 bg-blue-400/5 dark:bg-blue-400/10 rounded-full blur-3xl -z-10" />

            {/* Main content */}
            <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
                {children}
            </div>
        </motion.div>
    );
};

export default GameContainer;
