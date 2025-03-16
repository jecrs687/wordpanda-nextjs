"use client";
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

type LoaderSpinnerProps = {
    size?: 'small' | 'medium' | 'large';
    color?: 'primary' | 'secondary' | 'white';
    className?: string;
};

const LoaderSpinner = ({
    size = 'medium',
    color = 'primary',
    className
}: LoaderSpinnerProps) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const sizeClasses = {
        small: 'w-5 h-5',
        medium: 'w-10 h-10',
        large: 'w-16 h-16',
    };

    const colorClasses = {
        primary: 'text-emerald-500',
        secondary: 'text-indigo-500',
        white: 'text-white',
    };

    const spinTransition = {
        loop: Infinity,
        ease: "linear",
        duration: 1
    };

    return (
        <div className={clsx("flex items-center justify-center", className)}>
            <motion.div
                className={clsx(
                    sizeClasses[size],
                    colorClasses[color],
                    "relative"
                )}
                animate={{ rotate: 360 }}
                transition={spinTransition}
            >
                <div className="absolute w-full h-full rounded-full border-t-2 border-b-2 border-current"></div>
                <div className="absolute w-full h-full rounded-full border-r-2 border-l-2 border-current opacity-70" style={{ transform: 'rotate(45deg)' }}></div>
            </motion.div>

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.5, 1, 0.5] }}
                transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                }}
                className={clsx(
                    "absolute",
                    sizeClasses[size],
                    isDark ? 'text-emerald-400/30' : 'text-emerald-500/30',
                )}
            >
                <div className="w-full h-full rounded-full border-4 border-current"></div>
            </motion.div>
        </div>
    );
};

export default LoaderSpinner;
