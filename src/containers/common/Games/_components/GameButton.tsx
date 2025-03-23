'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import React from 'react';

type GameButtonProps = {
    children?: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
};

const GameButton = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    disabled = false,
    fullWidth = false,
    icon,
    className,
    type = 'button'
}: GameButtonProps) => {
    // Base styles
    const baseStyles = "relative inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";

    // Variant styles
    const variantStyles = {
        primary: "bg-emerald-500 hover:bg-emerald-600 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:text-white shadow-sm shadow-emerald-500/10 dark:shadow-emerald-700/20",
        secondary: "bg-indigo-500 hover:bg-indigo-600 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:text-white shadow-sm shadow-indigo-500/10 dark:shadow-indigo-700/20",
        outline: "border border-gray-300 dark:border-gray-600 bg-white hover:bg-gray-100 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200",
        ghost: "hover:bg-gray-100 text-gray-800 dark:hover:bg-gray-800 dark:text-gray-200",
        danger: "bg-rose-500 hover:bg-rose-600 text-white dark:bg-rose-600 dark:hover:bg-rose-500 dark:text-white shadow-sm shadow-rose-500/10 dark:shadow-rose-700/20"
    };

    // Size styles
    const sizeStyles = {
        sm: "text-xs h-8 px-3 rounded-lg gap-1.5",
        md: "text-sm h-10 px-4 rounded-lg gap-2",
        lg: "text-base h-12 px-6 rounded-xl gap-2.5"
    };

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                baseStyles,
                variantStyles[variant],
                sizeStyles[size],
                fullWidth ? 'w-full' : '',
                className
            )}
            whileHover={disabled ? {} : { scale: 1.02 }}
            whileTap={disabled ? {} : { scale: 0.98 }}
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
        </motion.button>
    );
};

export default GameButton;
