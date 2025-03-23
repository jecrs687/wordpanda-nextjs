'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { PawPrint } from 'lucide-react';
import Link from 'next/link';

type GameCardProps = {
    title: string;
    description: string;
    icon?: React.ReactNode;
    href: string;
    className?: string;
    isNew?: boolean;
};

const GameCard = ({
    title,
    description,
    icon = <PawPrint className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />,
    href,
    className,
    isNew = false
}: GameCardProps) => {
    return (
        <Link href={href} className={cn('block', className)}>
            <motion.div
                className="h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow relative"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
            >
                {isNew && (
                    <span className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                        New
                    </span>
                )}

                <div className="p-5">
                    <div className="bg-gray-100 dark:bg-gray-700/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        {icon}
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {title}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        {description}
                    </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200/50 dark:border-gray-700/50 px-5 py-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-2"></span>
                        Start playing
                    </p>
                </div>
            </motion.div>
        </Link>
    );
};

export default GameCard;
