import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { ReactNode } from 'react';

interface OnboardingButtonProps {
    onClick: () => void;
    children: ReactNode;
    variant?: 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function OnboardingButton({
    onClick,
    children,
    variant = 'primary',
    size = 'md',
    className
}: OnboardingButtonProps) {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    return (
        <motion.button
            onClick={onClick}
            whileHover={{
                scale: 1.03,
                y: -2,
                boxShadow: variant === 'primary'
                    ? isDark
                        ? '0 10px 25px -5px rgba(16, 185, 129, 0.3)'
                        : '0 10px 25px -5px rgba(79, 70, 229, 0.25)'
                    : 'none'
            }}
            whileTap={{ scale: 0.97, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={cn(
                "font-medium rounded-full relative overflow-hidden",
                "transition-colors duration-300 ease-in-out",
                {
                    // Primary button styling
                    "text-white shadow-lg": variant === 'primary',
                    "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600": variant === 'primary' && isDark,
                    "bg-gradient-to-r from-indigo-500 to-emerald-400 hover:from-indigo-600 hover:to-emerald-500": variant === 'primary' && !isDark,

                    // Secondary button styling
                    "backdrop-blur-md border": variant === 'secondary',
                    "bg-zinc-800/40 hover:bg-zinc-800/60 text-white border-zinc-700/50": variant === 'secondary' && isDark,
                    "bg-white/40 hover:bg-white/60 text-zinc-700 border-zinc-300/50": variant === 'secondary' && !isDark,

                    // Size variations
                    "px-4 py-2 text-sm": size === 'sm',
                    "px-6 py-2.5 text-base": size === 'md',
                    "px-8 py-3 text-lg": size === 'lg',
                },
                className
            )}
        >
            {/* Optional glow effect for primary button */}
            {variant === 'primary' && (
                <motion.div
                    className="absolute inset-0 bg-white opacity-0"
                    initial={{ opacity: 0 }}
                    whileHover={{
                        opacity: 0.2,
                        transition: { duration: 1, repeat: Infinity, repeatType: "reverse" }
                    }}
                />
            )}

            {children}
        </motion.button>
    );
}
