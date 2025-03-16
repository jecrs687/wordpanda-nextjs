'use client'
import { zoomOutMobile } from '@utils/zoomOut'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

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
}: {
    label?: string,
    placeholder?: string,
    type?: 'text' | 'password' | 'phone' | 'email',
    name: string,
    error?: string,
    value?: string,
    textarea?: boolean,
    onChange?: (e: any) => void,
    color?: 'white' | 'black',
    className?: string,
    onFocus?: (e: any) => void,
    onBlur?: (e: any) => void,
    title: string,
    disabled?: boolean,
    [x: string]: any
}) {
    const [hide, setHide] = useState(true)
    const toggleHide = () => setHide(!hide)
    const typePassword = hide ? 'password' : 'text'
    const [current, setCurrent] = useState(value);
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark';
    const [focused, setFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value);

    useEffect(() => {
        if (value !== undefined) {
            setCurrent(value);
            setHasValue(!!value);
        }
    }, [value]);

    // Phone formatting logic
    const updateValue = (e: any) => {
        if (type === 'phone') {
            e.target.value = e.target.value.replace(/\D/g, '');
            e.target.value = e.target.value.slice(0, 30);
            if (e.target.value.length > 10)
                e.target.value = e.target.value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
            else if (e.target.value.length > 6)
                e.target.value = e.target.value.replace(/^(\d{2})(\d{4})(\d{1})/, '($1) $2-$3');
            else if (e.target.value.length > 2)
                e.target.value = e.target.value.replace(/^(\d{2})(\d{1})/, '($1) $2');
            else if (e.target.value.length > 0)
                e.target.value = e.target.value.replace(/^(\d{1})/, '($1');
            setCurrent(e.target.value);
            e.target.value = e.target.value.replace(/\D/g, '');
            setHasValue(!!e.target.value);
            onChange && onChange(e);
        } else {
            setCurrent(e.target.value);
            setHasValue(!!e.target.value);
            onChange && onChange(e);
        }
    }

    const themeColor = color === 'white' ? 'primary' : 'secondary';

    const primaryColors = {
        bg: isDark ? 'bg-gray-800/90' : 'bg-white',
        border: isDark ? 'border-gray-700' : 'border-gray-200',
        focusBorder: 'border-emerald-400',
        focusRing: 'ring-emerald-400/30',
        text: isDark ? 'text-white' : 'text-gray-800',
        label: isDark ? 'text-gray-300' : 'text-gray-600',
        focusLabel: 'text-emerald-500'
    };

    const secondaryColors = {
        bg: isDark ? 'bg-gray-800/90' : 'bg-white',
        border: isDark ? 'border-gray-700' : 'border-gray-200',
        focusBorder: 'border-violet-400',
        focusRing: 'ring-violet-400/30',
        text: isDark ? 'text-white' : 'text-gray-800',
        label: isDark ? 'text-gray-300' : 'text-gray-600',
        focusLabel: 'text-violet-500'
    };

    const colors = themeColor === 'primary' ? primaryColors : secondaryColors;

    const inputClasses = clsx(
        'w-full px-8 py-5 transition-all duration-300 ease-out',
        'font-medium text-lg',
        'rounded-2xl backdrop-blur-sm',
        colors.bg, colors.text,
        'border-2 shadow-sm',
        error ? 'border-red-400 focus:border-red-400 ring-red-400/30' : colors.border,
        'focus:outline-none focus:ring-4 focus:shadow-md',
        !error && `focus:${colors.focusBorder} focus:${colors.focusRing}`,
        disabled ? 'opacity-60 cursor-not-allowed' : '',
        className
    );

    const handleFocus = (e: any) => {
        zoomOutMobile();
        setFocused(true);
        onFocus && onFocus(e);
    };

    const handleBlur = (e: any) => {
        zoomOutMobile();
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
        className: inputClasses,
        onFocus: handleFocus,
        onBlur: handleBlur,
        disabled,
        ...rest?.field,
    };

    const getIconColor = () => {
        if (error) return 'text-red-400';
        if (focused) {
            return themeColor === 'primary' ? 'text-emerald-500' : 'text-violet-500';
        }
        return isDark ? 'text-gray-400' : 'text-gray-500';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
                delay: 0.05
            }}
            className="mb-8 relative"
        >
            {/* Input Label */}
            {label && (
                <motion.div
                    className="relative z-0 mb-2"
                    animate={{
                        y: focused || hasValue ? 0 : 8,
                        opacity: focused || hasValue ? 1 : 0
                    }}
                >
                    <span
                        className={clsx(
                            "text-sm font-semibold ml-4",
                            error ? 'text-red-400' :
                                (focused
                                    ? themeColor === 'primary' ? 'text-emerald-500' : 'text-violet-500'
                                    : isDark ? 'text-gray-300' : 'text-gray-600')
                        )}
                    >
                        {label}
                    </span>
                </motion.div>
            )}

            {/* Input Field Container */}
            <div className="relative">
                {/* Input Type Icon */}
                <div className={clsx(
                    "absolute left-6 top-1/2 -translate-y-1/2",
                    getIconColor()
                )}>
                    {type === 'email' && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                            <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                        </svg>
                    )}
                    {type === 'password' && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                        </svg>
                    )}
                    {type === 'phone' && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                        </svg>
                    )}
                    {(type === 'text' || !type) && !textarea && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-3.873 8.703a4.126 4.126 0 017.746 0 .75.75 0 01-.351.92 7.47 7.47 0 01-3.522.877 7.47 7.47 0 01-3.522-.877.75.75 0 01-.351-.92zM15 8.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15zM14.25 12a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H15a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15z" clipRule="evenodd" />
                        </svg>
                    )}
                    {textarea && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm9.75 7.5a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6zm1.5-5.25a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0v-6a.75.75 0 01.75-.75zm-4.5 5.25a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6zm-3 0a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>

                {/* The Input Field */}
                <div className="relative">
                    {textarea ? (
                        <textarea
                            {...inputProps}
                            className={`${inputClasses} min-h-[160px] pl-16 resize-y pt-6`}
                        />
                    ) : (
                        <input {...inputProps} className={`${inputClasses} pl-16 h-16`} />
                    )}

                    {/* Animated underline/focus effect */}
                    <motion.div
                        className={clsx(
                            "absolute bottom-0 left-1/2 h-1.5 rounded-full -translate-x-1/2",
                            error ? 'bg-red-400' :
                                themeColor === 'primary' ? 'bg-emerald-400' : 'bg-violet-400'
                        )}
                        initial={{ width: '0%' }}
                        animate={{ width: focused ? '92%' : '0%' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                </div>

                {/* Password Toggle Button */}
                {type === 'password' && (
                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={clsx(
                            "absolute right-6 top-1/2 -translate-y-1/2",
                            "flex items-center justify-center",
                            "w-10 h-10 rounded-full",
                            "transition-colors",
                            isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
                            getIconColor()
                        )}
                        onClick={toggleHide}
                        aria-label={hide ? "Show password" : "Hide password"}
                    >
                        {hide ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
                                <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
                                <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
                            </svg>
                        )}
                    </motion.button>
                )}
            </div>

            {/* Error Message with Animation */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30
                        }}
                        className="overflow-hidden"
                    >
                        <div className="flex items-start gap-2 mt-3 ml-4">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5 text-red-400 mt-0.5 flex-shrink-0">
                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium text-red-400">
                                {Array.isArray(error) ? error.join('. ') : error}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Theme Toggle Easter Egg */}
            <motion.div
                className={clsx(
                    "absolute -right-2 -top-2",
                    "opacity-0 group-hover:opacity-100",
                    "transition-opacity duration-300"
                )}
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
            >
                {name === 'password' && (
                    <button
                        type="button"
                        className={clsx(
                            "p-1.5 rounded-full shadow-lg",
                            isDark ? 'bg-gray-700 text-amber-300' : 'bg-white text-violet-500'
                        )}
                        onClick={() => setTheme(isDark ? 'light' : 'dark')}
                        aria-label="Toggle theme"
                    >
                        {isDark ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                )}
            </motion.div>
        </motion.div>
    )
}

export default Input
