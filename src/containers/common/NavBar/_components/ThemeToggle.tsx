import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { memo, useCallback } from 'react';
import { NavIcons } from './NavIcons';

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark';

    const Sun = NavIcons.sun;
    const Moon = NavIcons.moon;

    // Memoize the theme toggle for better performance
    const toggleTheme = useCallback(() => {
        setTheme(isDark ? 'light' : 'dark');
    }, [isDark, setTheme]);

    // Animation variants
    const buttonVariants = {
        hover: {
            scale: 1.1,
            rotate: 5,
            boxShadow: isDark
                ? '0 0 12px rgba(251, 191, 36, 0.3)'
                : '0 0 12px rgba(124, 58, 237, 0.3)',
        },
        tap: { scale: 0.9 }
    };

    const iconVariants = {
        initial: { rotate: 0 },
        animate: { rotate: isDark ? 180 : 0 },
        transition: { duration: 0.6, type: "spring", stiffness: 200 }
    };

    return (
        <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            transition={{ type: "spring", stiffness: 500, damping: 17 }}
            onClick={toggleTheme}
            className={`p-2.5 rounded-full transition-all
                ${isDark
                    ? 'bg-gray-800/80 hover:bg-gray-700/90 text-amber-300'
                    : 'bg-gray-100 hover:bg-gray-200/90 text-violet-500'}`}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            <motion.div
                initial={false}
                animate={{ rotate: isDark ? 360 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                className="flex items-center justify-center"
            >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </motion.div>
        </motion.button>
    );
};

export default memo(ThemeToggle);
