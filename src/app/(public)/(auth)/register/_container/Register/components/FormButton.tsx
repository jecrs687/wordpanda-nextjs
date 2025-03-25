import LoaderSpinner from '@core/LoaderSpinner';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type FormButtonProps = {
    children: ReactNode;
    type?: 'button' | 'submit' | 'reset';
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    isLoading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    icon?: ReactNode;
    size?: 'sm' | 'md' | 'lg';
    ariaLabel?: string;
    className?: string;
};

export function FormButton({
    children,
    type = 'button',
    onClick,
    variant = 'primary',
    isLoading = false,
    disabled = false,
    fullWidth = false,
    icon,
    size = 'md',
    ariaLabel,
    className,
}: FormButtonProps) {
    const { t } = useTranslation();

    // Simplified, cleaner variant styles with solid colors
    const variantStyles = {
        primary: {
            background: "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800",
            text: "text-white",
            border: "",
            shadow: "shadow-md hover:shadow-lg",
        },
        secondary: {
            background: "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800",
            text: "text-white",
            border: "",
            shadow: "shadow-md hover:shadow-lg",
        },
        outline: {
            background: "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700",
            text: "text-gray-700 dark:text-gray-200",
            border: "border border-gray-300 dark:border-gray-600",
            shadow: "shadow-sm",
        },
    };

    // Size variants for responsive design
    const sizeStyles = {
        sm: "px-3 py-2 text-xs",
        md: "px-5 py-3 text-sm",
        lg: "px-6 py-3.5 text-base",
    };

    const currentStyle = variantStyles[variant];
    const currentSize = sizeStyles[size];
    const isDisabled = disabled || isLoading;

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.01 }}
            className={`
                relative ${currentSize} rounded-lg font-medium transition-all duration-200
                ${currentStyle.background}
                ${currentStyle.text}
                ${currentStyle.border}
                ${currentStyle.shadow}
                ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                ${fullWidth ? 'w-full' : ''}
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500
                ${className || ''}
            `}
            aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
            aria-busy={isLoading ? "true" : "false"}
            aria-disabled={isDisabled ? "true" : "false"}
        >
            <div className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                    <LoaderSpinner size="small" />
                ) : (
                    <>
                        {/* Icon if provided */}
                        {icon && <span className="text-lg flex-shrink-0">{icon}</span>}

                        {/* Text with better readability */}
                        <span className="whitespace-nowrap">
                            {children}
                        </span>
                    </>
                )}
            </div>
        </motion.button>
    );
}
