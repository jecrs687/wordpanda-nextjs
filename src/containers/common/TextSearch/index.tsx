"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Montserrat } from 'next/font/google';
import React, { useEffect, useState } from 'react';

const montserrat = Montserrat({ subsets: ['latin'], display: 'swap' });

type TextSearchProps = {
    label?: string;
    placeholder?: string;
    type?: string;
    title?: string;
    name?: string;
    error?: string | boolean;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    color?: 'white' | 'dark';
    className?: string;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    iconRight?: (() => React.ReactNode);
    debounceTime?: number;
    [key: string]: any;
};

function TextSearch({
    label,
    placeholder,
    type = 'text',
    title = '',
    name = '',
    error,
    value,
    onChange,
    color = 'white',
    className,
    onFocus,
    onBlur,
    disabled,
    iconRight,
    debounceTime = 300,
    ...rest
}: TextSearchProps) {
    const [inputValue, setInputValue] = useState(value || '');
    const [focused, setFocused] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted && theme === 'dark';

    // Sync with external value changes
    useEffect(() => {
        if (value !== undefined && value !== inputValue) {
            setInputValue(value);
        }
    }, [inputValue, value]);

    // Debounce logic for search
    useEffect(() => {
        const handler = setTimeout(() => {
            if (onChange && inputValue !== value) {
                const event = {
                    target: { value: inputValue }
                } as React.ChangeEvent<HTMLInputElement>;
                onChange(event);
            }
        }, debounceTime);

        return () => {
            clearTimeout(handler);
        };
    }, [inputValue, onChange, value, debounceTime]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setFocused(false);
        onBlur?.(e);
    };

    const clearInput = () => {
        setInputValue('');
        if (onChange) {
            const event = {
                target: { value: '' }
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(event);
        }
    };

    if (!mounted) {
        return null;
    }

    return (
        <div className={`relative w-full ${className || ''}`}>
            {label && (
                <motion.label
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    htmlFor={name}
                    className={`
                        ${montserrat.className} 
                        text-sm font-semibold ml-2 mb-1.5 block
                        transition-colors duration-200
                        ${error
                            ? 'text-rose-500 dark:text-rose-400'
                            : focused
                                ? 'text-emerald-500 dark:text-emerald-400'
                                : 'text-gray-700 dark:text-gray-300'
                        }
                    `}
                >
                    {label}
                </motion.label>
            )}

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <motion.div
                    animate={{
                        scale: focused ? 1.02 : 1,
                        boxShadow: focused
                            ? isDark
                                ? '0 0 0 2px rgba(16, 185, 129, 0.3), 0 4px 12px rgba(0, 0, 0, 0.25)'
                                : '0 0 0 2px rgba(16, 185, 129, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1)'
                            : 'none'
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        duration: 0.2
                    }}
                    className={`
                        relative flex items-center rounded-xl overflow-hidden
                        ${isDark
                            ? 'bg-gray-800/80 border-gray-700'
                            : 'bg-white/90 border-gray-200'
                        }
                        backdrop-blur-md
                        border transition-all duration-300
                        ${error
                            ? 'border-rose-500 dark:border-rose-500/70'
                            : focused
                                ? 'border-emerald-400 dark:border-emerald-500/70'
                                : isDark ? 'border-gray-700' : 'border-gray-200'
                        }
                        ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
                    `}
                >
                    <div className={`
                        absolute left-4 transition-colors duration-200
                        ${focused
                            ? 'text-emerald-500 dark:text-emerald-400'
                            : 'text-gray-400 dark:text-gray-500'
                        }
                    `}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>

                    <input
                        type={type}
                        id={name}
                        name={name}
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder={placeholder}
                        disabled={disabled}
                        className={`
                            ${montserrat.className}
                            w-full py-3.5 pl-12 pr-4
                            bg-transparent
                            text-base focus:outline-none
                            transition-colors duration-200
                            ${isDark
                                ? 'text-white placeholder:text-gray-400'
                                : 'text-gray-900 placeholder:text-gray-500'
                            }
                            ${(iconRight || inputValue) && "pr-12"}
                        `}
                        {...rest}
                    />

                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                        <AnimatePresence>
                            {inputValue && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    type="button"
                                    onClick={clearInput}
                                    className={`
                                        p-1.5 rounded-full mr-1
                                        transition-colors duration-200
                                        ${isDark
                                            ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                        }
                                    `}
                                    aria-label="Clear search"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </motion.button>
                            )}
                        </AnimatePresence>
                        {iconRight && iconRight()}
                    </div>
                </motion.div>

                <AnimatePresence>
                    {error && typeof error === 'string' && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className={`${montserrat.className} text-rose-500 dark:text-rose-400 text-xs mt-2 ml-2 font-medium`}
                        >
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

export default TextSearch;
