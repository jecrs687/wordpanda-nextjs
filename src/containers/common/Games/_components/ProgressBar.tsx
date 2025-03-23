'use client';

import { motion } from 'framer-motion';

type ProgressBarProps = {
    value: number;
    max: number;
    height?: 'sm' | 'md' | 'lg';
    color?: 'default' | 'success' | 'warning' | 'danger';
    showPercentage?: boolean;
    animate?: boolean;
    className?: string;
};

const ProgressBar = ({
    value,
    max,
    height = 'md',
    color = 'default',
    showPercentage = false,
    animate = true,
    className = ''
}: ProgressBarProps) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const heightClasses = {
        sm: 'h-1',
        md: 'h-1.5',
        lg: 'h-2.5'
    };

    const colorClasses = {
        default: 'bg-emerald-500 dark:bg-emerald-400',
        success: 'bg-green-500 dark:bg-green-400',
        warning: 'bg-amber-500 dark:bg-amber-400',
        danger: 'bg-rose-500 dark:bg-rose-400'
    };

    return (
        <div className={`w-full flex items-center gap-3 ${className}`}>
            <div className={`w-full ${heightClasses[height]} bg-gray-200 dark:bg-gray-700/50 rounded-full overflow-hidden`}>
                <motion.div
                    className={`h-full ${colorClasses[color]} rounded-full`}
                    initial={{ width: animate ? 0 : `${percentage}%` }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: animate ? 0.5 : 0 }}
                />
            </div>

            {showPercentage && (
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[40px] text-right">
                    {Math.round(percentage)}%
                </span>
            )}
        </div>
    );
};

export default ProgressBar;
