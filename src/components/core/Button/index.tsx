"use client";
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import React from 'react';

type ButtonProps = {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'outline' | 'text';
    variety?: 'primary' | 'secondary' | 'outline' | 'text'; // Alternative prop name
    size?: 'small' | 'medium' | 'large';
    className?: string;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    loading?: boolean;
    [key: string]: any;
};

const Button = ({
    children,
    onClick,
    type = 'button',
    disabled = false,
    variant,
    variety,
    size = 'medium',
    className,
    fullWidth = false,
    icon,
    iconPosition = 'left',
    leftIcon,
    rightIcon,
    loading = false,
    ...rest
}: ButtonProps) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Support both variant and variety props (backward compatibility)
    const buttonVariant = variant || variety || 'primary';

    // Use leftIcon/rightIcon props if provided, otherwise use icon with iconPosition
    const finalLeftIcon = leftIcon || (iconPosition === 'left' ? icon : undefined);
    const finalRightIcon = rightIcon || (iconPosition === 'right' ? icon : undefined);

    const variantClasses = {
        primary: clsx(
            "bg-gradient-to-r from-emerald-400 to-emerald-500",
            "hover:from-emerald-500 hover:to-emerald-600",
            "text-white shadow-lg",
            !disabled && "hover:shadow-emerald-400/30"
        ),
        secondary: clsx(
            "bg-gradient-to-r from-indigo-500 to-cyan-400",
            "hover:from-indigo-600 hover:to-cyan-500",
            "text-white shadow-lg",
            !disabled && "hover:shadow-indigo-500/30"
        ),
        outline: clsx(
            "border-2",
            isDark ? "border-gray-700 text-white" : "border-gray-300 text-gray-800",
            !disabled && (isDark ? "hover:bg-gray-800" : "hover:bg-gray-100")
        ),
        text: clsx(
            isDark ? "text-gray-200" : "text-gray-800",
            !disabled && (isDark ? "hover:bg-gray-800" : "hover:bg-gray-100")
        ),
    };

    const sizeClasses = {
        small: "px-3 py-1 text-sm",
        medium: "px-4 py-2",
        large: "px-6 py-3 text-lg",
    };

    const baseClasses = clsx(
        "rounded-xl font-medium transition-all duration-300",
        "focus:outline-none focus:ring-4",
        "inline-flex items-center justify-center",
        sizeClasses[size],
        variantClasses[buttonVariant],
        {
            "opacity-60 cursor-not-allowed": disabled || loading,
            "w-full": fullWidth,
        },
        className
    );

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={baseClasses}
            whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
            whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
            {...rest}
        >
            {loading ? (
                <div className="flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    <span>Carregando...</span>
                </div>
            ) : (
                <>
                    {finalLeftIcon && (
                        <span className="mr-2">{finalLeftIcon}</span>
                    )}
                    {children}
                    {finalRightIcon && (
                        <span className="ml-2">{finalRightIcon}</span>
                    )}
                </>
            )}
        </motion.button>
    );
};

export default Button;
