"use client";
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

type InputProps = {
    label?: string;
    placeholder?: string;
    type?: string;
    title?: string;
    name?: string;
    error?: string | boolean;
    value?: string | number;
    textarea?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    color?: 'white' | 'dark';
    className?: string;
    onFocus?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    disabled?: boolean;
    field?: any;
    [key: string]: any;
};

function Input({
    label,
    placeholder,
    type = 'text',
    title,
    name,
    error,
    value,
    textarea = false,
    onChange,
    color = 'white',
    className,
    onFocus,
    onBlur,
    disabled,
    ...rest
}: InputProps) {
    const [current, setCurrent] = useState(value || '');
    const [hasValue, setHasValue] = useState(!!value);
    const [focused, setFocused] = useState(false);
    const [typePassword, setTypePassword] = useState('password');
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    useEffect(() => {
        if (value !== undefined) {
            setCurrent(value);
            setHasValue(!!value);
        }
    }, [value]);

    // Phone formatting logic
    const updateValue = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (type === 'phone') {
            e.target.value = e.target.value.replace(/\D/g, '');
            e.target.value = e.target.value.slice(0, 30);
            if (e.target.value.length > 10) e.target.value = e.target.value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
            else if (e.target.value.length > 6) e.target.value = e.target.value.replace(/^(\d{2})(\d{4})(\d{1})/, '($1) $2-$3');
            else if (e.target.value.length > 2) e.target.value = e.target.value.replace(/^(\d{2})(\d{1})/, '($1) $2');
            else if (e.target.value.length > 0) e.target.value = e.target.value.replace(/^(\d{1})/, '($1');
            setCurrent(e.target.value);
            e.target.value = e.target.value.replace(/\D/g, '');
            setHasValue(!!e.target.value);
            onChange && onChange(e);
        } else {
            setCurrent(e.target.value);
            setHasValue(!!e.target.value);
            onChange && onChange(e);
        }
    };

    const themeColor = color === 'white' ? 'primary' : 'secondary';

    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFocused(true);
        onFocus && onFocus(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFocused(false);
        onBlur && onBlur(e);
    };

    const inputProps = {
        type: type === 'password' ? typePassword : type,
        name,
        id: name,
        value: current,
        onChange: updateValue,
        placeholder: focused || !label ? placeholder : undefined,
        onFocus: handleFocus,
        onBlur: handleBlur,
        disabled,
        ...rest?.field
    };

    const getIconColor = () => {
        if (error) return 'text-rose-500';
        if (focused) {
            return themeColor === 'primary' ? 'text-emerald-500' : 'text-indigo-500';
        }
        return isDark ? 'text-gray-400' : 'text-gray-500';
    };

    const inputClasses = clsx(
        'w-full px-4 py-3 transition-all duration-300 ease-out',
        'font-medium text-base',
        'rounded-xl backdrop-blur-sm',
        isDark ? 'bg-gray-900/40 border-gray-700' : 'bg-white/80 border-gray-200',
        isDark ? 'text-white' : 'text-gray-800',
        'border shadow-sm',
        error
            ? 'border-rose-400 focus:border-rose-400 ring-rose-400/30'
            : focused
                ? themeColor === 'primary'
                    ? 'border-emerald-400 focus:border-emerald-400 ring-emerald-400/20'
                    : 'border-indigo-400 focus:border-indigo-400 ring-indigo-400/20'
                : '',
        'focus:outline-none focus:ring-4',
        disabled ? 'opacity-60 cursor-not-allowed' : '',
        className
    );

    return (
        <div className="relative mb-4">
            {label && (
                <label
                    htmlFor={name}
                    className={clsx(
                        "text-sm font-semibold ml-4 mb-1 block",
                        error ? 'text-rose-500' :
                            focused ?
                                themeColor === 'primary' ? 'text-emerald-500' : 'text-indigo-500' :
                                isDark ? 'text-gray-300' : 'text-gray-600'
                    )}
                >
                    {label}
                </label>
            )}

            <div className="relative">
                {type === 'password' && (
                    <div
                        className={clsx(
                            "absolute right-4 top-1/2 -translate-y-1/2",
                            "flex items-center justify-center",
                            "w-10 h-10 rounded-full",
                            "transition-colors cursor-pointer",
                            isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100',
                            getIconColor()
                        )}
                        onClick={() => setTypePassword(typePassword === 'password' ? 'text' : 'password')}
                    >
                        {typePassword === 'password' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
                                <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
                                <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
                            </svg>
                        )}
                    </div>
                )}

                {textarea ? (
                    <textarea
                        {...inputProps}
                        className={inputClasses}
                        rows={5}
                    />
                ) : (
                    <input
                        {...inputProps}
                        className={inputClasses}
                    />
                )}

                {focused && (
                    <motion.div
                        className={clsx(
                            "absolute bottom-0 left-1/2 h-1 rounded-full -translate-x-1/2",
                            error ? 'bg-rose-500' : themeColor === 'primary' ? 'bg-emerald-400' : 'bg-indigo-400'
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: '92%' }}
                        transition={{ duration: 0.3 }}
                    />
                )}
            </div>

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
    );
}

export default Input;
