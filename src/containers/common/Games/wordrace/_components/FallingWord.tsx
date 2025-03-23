'use client';

import { motion } from 'framer-motion';
import { useCallback, useMemo } from 'react';

type FallingWordProps = {
    word: string;
    position: number; // 0-10 vertical position
    speed?: number; // Animation speed multiplier
    isCorrect?: boolean;
};

const FallingWord = ({
    word,
    position,
    speed = 1,
    isCorrect = false
}: FallingWordProps) => {
    // Calculate horizontal position randomly but consistently for each word
    const horizontalPosition = useMemo(() => {
        // Generate a consistent random position based on the word itself
        const charSum = word.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        return (charSum % 80) + 5; // Position between 5% and 85% of container width
    }, [word]);

    // Generate a consistent random slight rotation
    const rotation = useMemo(() => {
        const charSum = word.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        return ((charSum % 10) - 5); // Rotation between -5 and 5 degrees
    }, [word]);

    // Calculate vertical position (0% to 90%)
    const verticalPosition = position * 10;

    // Style based on word difficulty (longer words are more challenging)
    const getDifficultyStyle = useCallback(() => {
        if (word.length >= 8) {
            return 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
        } else if (word.length >= 6) {
            return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
        } else {
            return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
        }
    }, [word]);

    // Render falling word
    return (
        <motion.div
            className={`absolute px-3 py-1.5 rounded-lg border shadow-sm ${isCorrect
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                    : getDifficultyStyle()
                }`}
            style={{
                left: `${horizontalPosition}%`,
                top: `${verticalPosition}%`,
                transform: `rotate(${rotation}deg)`,
            }}
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{
                opacity: isCorrect ? [1, 0] : 1,
                scale: isCorrect ? [1, 1.2] : 1,
                y: isCorrect ? -30 : 0
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
                duration: isCorrect ? 0.5 : 0.3,
                ease: "easeOut"
            }}
        >
            <span className="font-medium">{word}</span>
        </motion.div>
    );
};

export default FallingWord;
