"use client";
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';

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
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Sync with external value changes
    useEffect(() => {
        if (value !== undefined && value !== inputValue) {
            setInputValue(value);
        }
    }, [value]);

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

    return (
        <div className={clsx("relative w-full", className)}>
            {label && (
                <label
                    htmlFor={name}
                    className={clsx(
                        "text-sm font-semibold ml-4 mb-1 block",
                        error ? 'text-rose-500' :
                            focused ? 'text-emerald-500' :
                                isDark ? 'text-gray-300' : 'text-gray-600'
                    )}
                >
                    {label}
                </label>
            )}

            <div className="relative">
                <motion.div
                    initial={false}
                    animate={{ scale: focused ? 1.02 : 1 }}
                    transition={{ duration: 0.2 }}
                    className={clsx(
                        "relative flex items-center rounded-xl overflow-hidden",
                        isDark ? 'bg-gray-900/40 shadow-lg' : 'bg-white/90 shadow-md',
                        "border transition-all duration-300",
                        error ? 'border-rose-400' :
                            focused ? 'border-emerald-400 ring-4 ring-emerald-400/20' :
                                isDark ? 'border-gray-700' : 'border-gray-200'
                    )}
                >
                    <div className={clsx(
                        "absolute left-4 text-gray-400",
                        focused && "text-emerald-500"
                    )}>
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
                        className={clsx(
                            "w-full py-3 pl-12 pr-4",
                            "bg-transparent backdrop-blur-sm",
                            "text-base focus:outline-none",
                            isDark ? 'text-white placeholder:text-gray-400' : 'text-gray-900 placeholder:text-gray-500',
                            (iconRight || inputValue) && "pr-12",
                            disabled && "opacity-60 cursor-not-allowed"
                        )}
                        {...rest}
                    />

                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                        {inputValue && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                type="button"
                                onClick={clearInput}
                                className={clsx(
                                    "p-1 rounded-full mr-1",
                                    isDark ? "text-gray-400 hover:text-gray-300 hover:bg-gray-800" :
                                        "text-gray-500 hover:text-gray-600 hover:bg-gray-100"
                                )}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </motion.button>
                        )}
                        {iconRight && iconRight()}
                    </div>
                </motion.div>

                {error && typeof error === 'string' && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-rose-500 text-xs mt-1 ml-4"
                    >
                        {error}
                    </motion.p>
                )}
            </div>
        </div>
    );
}

export default TextSearch;
