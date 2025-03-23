'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';

type BadgeProps = {
    children: React.ReactNode;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
    pulse?: boolean;
    className?: string;
};

const Badge = ({
    children,
    variant = 'default',
    size = 'md',
    icon,
    pulse = false,
    className
}: BadgeProps) => {
    const variantStyles = {
        default: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
        primary: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
        success: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
        warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
        danger: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
        info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
    };

    const sizeStyles = {
        sm: 'py-0.5 px-2 text-xs rounded',
        md: 'py-1 px-2.5 text-sm rounded-md',
        lg: 'py-1.5 px-3 text-base rounded-lg'
    };

    return (
        <motion.span
            className={cn(
                'inline-flex items-center font-medium gap-1 border border-transparent',
                variantStyles[variant],
                sizeStyles[size],
                pulse && 'animate-pulse',
                className
            )}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
        </motion.span>
    );
};

export default Badge;
