'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, PawPrint } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

type GameHeaderProps = {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    backLink?: string;
};

const GameHeader = ({
    title,
    description,
    icon = <PawPrint className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
    backLink = '/extension/games'
}: GameHeaderProps) => {
    return (
        <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center mb-2">
                <Link href={backLink} className="mr-2">
                    <motion.div
                        className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-full border border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </motion.div>
                </Link>

                <div className="flex items-center">
                    <div className="p-2 mr-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                        {icon}
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
                </div>
            </div>

            {description && (
                <p className="text-gray-600 dark:text-gray-300 ml-14">
                    {description}
                </p>
            )}
        </motion.div>
    );
};

export default GameHeader;
