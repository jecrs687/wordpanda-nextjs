'use client';

import { motion } from 'framer-motion';

type LetterTileProps = {
    letter: string;
    onClick?: () => void;
    isActive?: boolean;
    isCorrect?: boolean;
    isWrong?: boolean;
    isSelected?: boolean;
    size?: 'sm' | 'md' | 'lg';
};

const LetterTile = ({
    letter,
    onClick,
    isActive = false,
    isCorrect = false,
    isWrong = false,
    isSelected = false,
    size = 'md'
}: LetterTileProps) => {
    const sizeClasses = {
        sm: 'w-8 h-8 text-lg',
        md: 'w-10 h-10 text-xl',
        lg: 'w-12 h-12 text-2xl'
    };

    // Determine tile style based on state
    const getTileStyles = () => {
        if (isCorrect) {
            return 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-400 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300';
        }
        if (isWrong) {
            return 'bg-rose-100 dark:bg-rose-900/30 border-rose-400 dark:border-rose-700 text-rose-700 dark:text-rose-300';
        }
        if (isSelected) {
            return 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-400 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300';
        }
        if (isActive) {
            return 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white shadow-sm';
        }
        return 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500';
    };

    return (
        <motion.div
            className={`${sizeClasses[size]} flex items-center justify-center rounded-lg border-2 font-bold uppercase ${getTileStyles()} ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
            whileHover={onClick ? { scale: 1.1 } : undefined}
            whileTap={onClick ? { scale: 0.95 } : undefined}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
        >
            {letter}
        </motion.div>
    );
};

export default LetterTile;
