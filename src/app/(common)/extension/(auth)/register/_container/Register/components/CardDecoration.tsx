'use client';
import { motion } from 'framer-motion';

interface CardDecorationProps {
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    color?: string;
}

export function CardDecoration({ position, color = 'emerald' }: CardDecorationProps) {
    // Position styling
    const positionClasses = {
        'top-left': 'top-0 left-0',
        'top-right': 'top-0 right-0 rotate-90',
        'bottom-left': 'bottom-0 left-0 -rotate-90',
        'bottom-right': 'bottom-0 right-0 rotate-180',
    };

    // Color styling
    const colorClasses = {
        'emerald': 'text-emerald-500 dark:text-emerald-400',
        'blue': 'text-blue-500 dark:text-blue-400',
        'indigo': 'text-indigo-500 dark:text-indigo-400',
        'purple': 'text-purple-500 dark:text-purple-400',
    };

    return (
        <motion.div
            className={`absolute ${positionClasses[position]} ${colorClasses[color as keyof typeof colorClasses]} w-6 h-6 opacity-70`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.7, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H12C12 6.627 6.627 12 0 12V0Z" fill="currentColor" />
            </svg>
        </motion.div>
    );
}
