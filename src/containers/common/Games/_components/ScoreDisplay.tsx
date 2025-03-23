'use client';

import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

type ScoreDisplayProps = {
    score: number;
    maxScore?: number;
    size?: 'sm' | 'md' | 'lg';
    showIcon?: boolean;
};

const ScoreDisplay = ({
    score,
    maxScore,
    size = 'md',
    showIcon = true
}: ScoreDisplayProps) => {
    const sizes = {
        sm: {
            container: 'px-3 py-2',
            icon: 'h-3.5 w-3.5',
            scoreText: 'text-lg',
            labelText: 'text-xs'
        },
        md: {
            container: 'px-4 py-3',
            icon: 'h-4 w-4',
            scoreText: 'text-xl',
            labelText: 'text-xs'
        },
        lg: {
            container: 'px-5 py-4',
            icon: 'h-5 w-5',
            scoreText: 'text-2xl',
            labelText: 'text-sm'
        }
    };

    return (
        <motion.div
            className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 ${sizes[size].container} flex items-center gap-3`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
        >
            {showIcon && (
                <div className="p-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-900/30">
                    <Award className={`${sizes[size].icon} text-emerald-600 dark:text-emerald-400`} />
                </div>
            )}
            <div>
                <p className={`${sizes[size].labelText} text-gray-500 dark:text-gray-400`}>
                    {maxScore ? 'Score' : 'Current Score'}
                </p>
                <p className={`${sizes[size].scoreText} font-bold text-gray-900 dark:text-white`}>
                    {score}{maxScore ? `/${maxScore}` : ''}
                </p>
            </div>
        </motion.div>
    );
};

export default ScoreDisplay;
