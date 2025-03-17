import clsx from 'clsx';
import { ReactNode } from 'react';

type ButtonVariety =
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'violet'
    | 'amber'
    | 'blue'
    | 'danger';

type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    variety?: ButtonVariety;
    type?: 'button' | 'submit';
    href?: string;
    size?: ButtonSize;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    fullWidth?: boolean;
    isLoading?: boolean;
    [key: string]: any;
}

export default function Button({
    children,
    className,
    variety = 'primary',
    onClick,
    type = 'button',
    size = 'medium',
    leftIcon,
    rightIcon,
    fullWidth,
    isLoading,
    whileHover,
    whileTap,
    ...props
}: ButtonProps) {
    // Core button styling
    const baseClasses =
        "relative inline-flex items-center justify-center font-medium transition-colors duration-300 ease-in-out " +
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-950";

    // Size variations with refined proportions
    const sizeClasses: Record<ButtonSize, string> = {
        small: "text-xs px-3 py-1.5 rounded-lg gap-1.5",
        medium: "text-sm px-4 py-2.5 rounded-xl gap-2",
        large: "text-base px-6 py-3 rounded-xl gap-2.5 font-semibold"
    };

    // Enhanced variety classes with detailed attention to light/dark modes
    const varietyClasses: Record<ButtonVariety, string> = {
        primary:
            "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white " +
            "shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-emerald-700 " +
            "active:shadow-inner active:from-emerald-700 active:to-emerald-800 " +
            "focus:ring-emerald-500/50 dark:focus:ring-emerald-400/50",

        secondary:
            "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200 active:bg-gray-300 " +
            "dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:active:bg-gray-600 " +
            "focus:ring-gray-500/50 dark:focus:ring-gray-400/50",

        outline:
            "bg-transparent border-2 border-emerald-500 text-emerald-600 " +
            "hover:bg-emerald-50 hover:text-emerald-700 active:bg-emerald-100 " +
            "dark:text-emerald-400 dark:border-emerald-400 dark:hover:bg-emerald-900/30 " +
            "dark:hover:text-emerald-300 dark:active:bg-emerald-800/40 " +
            "focus:ring-emerald-500/50 dark:focus:ring-emerald-400/50",

        ghost:
            "bg-transparent text-emerald-600 hover:bg-emerald-50/70 hover:text-emerald-700 " +
            "active:bg-emerald-100 dark:text-emerald-400 dark:hover:bg-emerald-900/30 " +
            "dark:hover:text-emerald-300 dark:active:bg-emerald-800/40 " +
            "focus:ring-emerald-500/50 dark:focus:ring-emerald-400/50",

        violet:
            "bg-gradient-to-r from-violet-500 to-violet-600 text-white " +
            "shadow-md hover:shadow-lg hover:from-violet-600 hover:to-violet-700 " +
            "active:shadow-inner active:from-violet-700 active:to-violet-800 " +
            "focus:ring-violet-500/50 dark:focus:ring-violet-400/50",

        amber:
            "bg-amber-400 text-gray-900 shadow-md hover:bg-amber-500 hover:shadow-lg " +
            "active:bg-amber-600 active:shadow-inner " +
            "focus:ring-amber-400/50 dark:focus:ring-amber-300/50",

        blue:
            "bg-blue-500 text-white shadow-md hover:bg-blue-600 hover:shadow-lg " +
            "active:bg-blue-700 active:shadow-inner " +
            "focus:ring-blue-500/50 dark:focus:ring-blue-400/50",

        danger:
            "bg-red-500 text-white shadow-md hover:bg-red-600 hover:shadow-lg " +
            "active:bg-red-700 active:shadow-inner " +
            "focus:ring-red-500/50 dark:focus:ring-red-400/50"
    };

    // State classes
    const stateClasses = {
        disabled: "opacity-60 cursor-not-allowed pointer-events-none",
        fullWidth: "w-full",
        loading: "cursor-wait"
    };

    // Spinner sizing based on button size
    const spinnerSizeClasses: Record<ButtonSize, string> = {
        small: "w-3 h-3",
        medium: "w-4 h-4",
        large: "w-5 h-5"
    };

    // Icon sizing based on button size
    const iconSizeClasses: Record<ButtonSize, string> = {
        small: "text-xs",
        medium: "text-sm",
        large: "text-lg"
    };

    // Determine if the button uses a gradient background
    const isGradientButton = variety === 'primary' || variety === 'violet';

    return (
        <button
            className={clsx(
                baseClasses,
                sizeClasses[size],
                varietyClasses[variety],
                props.disabled && stateClasses.disabled,
                isLoading && stateClasses.loading,
                fullWidth && stateClasses.fullWidth,
                className
            )}
            onClick={onClick}
            type={type}
            disabled={props.disabled || isLoading}
            {...props}
        >
            {/* Loading spinner */}
            {isLoading && (
                <span className="absolute inset-0 flex items-center justify-center bg-inherit rounded-xl">
                    <svg
                        className={clsx(
                            "animate-spin text-current",
                            spinnerSizeClasses[size]
                        )}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                </span>
            )}

            {/* Button content with conditional opacity when loading */}
            <span className={clsx("flex items-center gap-2", isLoading && "opacity-0")}>
                {leftIcon && (
                    <span className={clsx("inline-flex", iconSizeClasses[size])}>
                        {leftIcon}
                    </span>
                )}

                <span>{children}</span>

                {rightIcon && (
                    <span className={clsx("inline-flex", iconSizeClasses[size])}>
                        {rightIcon}
                    </span>
                )}
            </span>

            {/* Enhanced hover effect for gradient buttons */}
            {isGradientButton && !props.disabled && !isLoading && (
                <span className="absolute inset-0 rounded-xl overflow-hidden">
                    <span className="absolute inset-0 opacity-0 hover:opacity-20 bg-white transition-opacity duration-300" />
                </span>
            )}

            {/* Ripple effect for non-gradient buttons */}
            {!isGradientButton && !props.disabled && !isLoading && (
                <span className="absolute inset-0 rounded-xl overflow-hidden">
                    <span className="absolute inset-0 opacity-0 hover:opacity-10 bg-black dark:bg-white transition-opacity duration-300" />
                </span>
            )}
        </button>
    );
}