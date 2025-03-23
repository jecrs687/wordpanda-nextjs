'use client';

import { motion, Variants } from 'framer-motion';
import { PawPrint } from 'lucide-react';

type WordAssociationCardProps = {
    word: string;
    isSelected: boolean;
    isMatched: boolean;
    disabled?: boolean;
    onClick: () => void;
    variants?: Variants;
};

const WordAssociationCard = ({
    word,
    isSelected,
    isMatched,
    disabled = false,
    onClick,
    variants
}: WordAssociationCardProps) => {
    // Determine card state styles
    const getCardStyles = () => {
        if (isMatched) {
            return "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 opacity-80";
        }
        if (isSelected) {
            return "bg-indigo-100 dark:bg-indigo-900/50 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 transform scale-105 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/30";
        }
        return "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750 hover:shadow-md";
    };

    return (
        <motion.div
            variants={variants}
            whileHover={!disabled ? { scale: 1.05 } : undefined}
            whileTap={!disabled ? { scale: 0.98 } : undefined}
            className={`relative backdrop-blur-sm rounded-xl border overflow-hidden transition-all duration-300 ${getCardStyles()}`}
            onClick={!disabled ? onClick : undefined}
            style={{ cursor: disabled ? 'default' : 'pointer' }}
        >
            <div className="aspect-square p-4 flex flex-col items-center justify-center text-center">
                {isMatched && (
                    <motion.div
                        className="absolute top-2 right-2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <PawPrint className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                    </motion.div>
                )}

                <motion.p
                    className="text-lg font-medium"
                    layout
                >
                    {word}
                </motion.p>
            </div>
        </motion.div>
    );
};

export default WordAssociationCard;
