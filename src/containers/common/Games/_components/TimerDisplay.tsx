'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

type TimerDisplayProps = {
    time: number; // time in seconds
    isCountdown?: boolean;
    size?: 'sm' | 'md' | 'lg';
    showIcon?: boolean;
    lowTimeThreshold?: number; // when time is considered "low" for countdown timers
};

const TimerDisplay = ({
    time,
    isCountdown = true,
    size = 'md',
    showIcon = true,
    lowTimeThreshold = 30 // 30 seconds default
}: TimerDisplayProps) => {
    const sizes = {
        sm: {
            container: 'px-3 py-2',
            icon: 'h-3.5 w-3.5',
            timeText: 'text-lg',
            labelText: 'text-xs'
        },
        md: {
            container: 'px-4 py-3',
            icon: 'h-4 w-4',
            timeText: 'text-xl',
            labelText: 'text-xs'
        },
        lg: {
            container: 'px-5 py-4',
            icon: 'h-5 w-5',
            timeText: 'text-2xl',
            labelText: 'text-sm'
        }
    };

    // Format time as mm:ss
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // For countdown timer, apply warning color when time is low
    const isLowTime = isCountdown && time <= lowTimeThreshold;

    return (
        <motion.div
            className={`backdrop-blur-sm rounded-lg border ${isLowTime
                    ? 'bg-rose-50/90 dark:bg-rose-900/30 border-rose-200/50 dark:border-rose-800/50 animate-pulse'
                    : 'bg-white/90 dark:bg-gray-800/90 border-gray-200/50 dark:border-gray-700/50'
                } ${sizes[size].container} flex items-center gap-3`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
        >
            {showIcon && (
                <div className={`p-1.5 rounded-full ${isLowTime
                        ? 'bg-rose-200/80 dark:bg-rose-800/30'
                        : 'bg-blue-100/80 dark:bg-blue-900/30'
                    }`}>
                    <Clock className={`${sizes[size].icon} ${isLowTime
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-blue-600 dark:text-blue-400'
                        }`} />
                </div>
            )}
            <div>
                <p className={`${sizes[size].labelText} ${isLowTime
                        ? 'text-rose-500 dark:text-rose-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                    {isCountdown ? 'Time Left' : 'Time'}
                </p>
                <p className={`${sizes[size].timeText} font-bold ${isLowTime
                        ? 'text-rose-600 dark:text-rose-300'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                    {formatTime(time)}
                </p>
            </div>
        </motion.div>
    );
};

export default TimerDisplay;
