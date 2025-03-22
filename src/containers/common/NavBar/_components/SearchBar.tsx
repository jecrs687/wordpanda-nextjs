import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { memo, useCallback, useState } from 'react';
import { NavIcons } from './NavIcons';

interface SearchBarProps {
    onChange: (query: string) => void;
}

const SearchBar = ({ onChange }: SearchBarProps) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState('');

    const Search = NavIcons.search;
    const Close = NavIcons.close;

    // Memoize handlers for better performance
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        onChange(e.target.value);
    }, [onChange]);

    const handleClear = useCallback(() => {
        setValue('');
        onChange('');
    }, [onChange]);

    const handleFocus = useCallback(() => setIsFocused(true), []);
    const handleBlur = useCallback(() => setIsFocused(false), []);

    // Animation variants
    const containerVariants = {
        focus: {
            scale: 1.01,
            transition: { duration: 0.2 }
        },
        blur: {
            scale: 1,
            transition: { duration: 0.2 }
        }
    };

    return (
        <motion.div
            className="relative group"
            variants={containerVariants}
            animate={isFocused ? "focus" : "blur"}
        >
            <div
                className={`flex items-center overflow-hidden rounded-xl transition-all duration-200
                ${isDark
                        ? 'bg-gray-900/90 border border-gray-800 focus-within:border-emerald-700'
                        : 'bg-gray-100/90 border border-gray-200 focus-within:border-emerald-300'
                    }
                ${isFocused ? `ring-2 ${isDark ? 'ring-emerald-600/20' : 'ring-emerald-400/30'}` : ''}`}
            >
                <span className={`pl-3 ${isFocused ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : 'text-gray-400'}`}>
                    <Search size={18} />
                </span>

                <input
                    type="text"
                    placeholder="Buscar..."
                    value={value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={`w-full py-2.5 px-2 text-sm bg-transparent outline-none transition-colors
                    ${isDark
                            ? 'text-white placeholder-gray-500'
                            : 'text-gray-900 placeholder-gray-500'}`}
                />

                <AnimatePresence>
                    {value && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleClear}
                            className={`pr-3 ${isDark
                                ? 'text-gray-400 hover:text-gray-200'
                                : 'text-gray-400 hover:text-gray-600'}`}
                            aria-label="Clear search"
                        >
                            <Close size={16} />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default memo(SearchBar);
