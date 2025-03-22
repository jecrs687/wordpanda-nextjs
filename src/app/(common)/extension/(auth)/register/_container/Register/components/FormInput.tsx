'use client';
import { motion } from 'framer-motion';

interface FormInputProps {
    name: string;
    title: string;
    type: string;
    placeholder: string;
    error?: string;
    description?: string;
    optional?: boolean;
    min?: number;
    max?: number;
    defaultValue?: string;
    icon?: string;
}

export function FormInput({
    name,
    title,
    type,
    placeholder,
    error,
    description,
    optional = false,
    min,
    max,
    defaultValue,
    icon
}: FormInputProps) {
    const renderIcon = () => {
        switch (icon) {
            case 'envelope':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                );
            case 'user':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                );
            case 'lock':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                );
            case 'shield-check':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                );
            case 'calendar':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                );
            case 'phone':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                );
            case 'target':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-baseline mb-1.5">
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                    {title}
                </label>
                {optional && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md">Optional</span>
                )}
            </div>
            <div className="relative group">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-emerald-500 transition-colors duration-200">
                        {renderIcon()}
                    </div>
                )}

                <motion.input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    min={min}
                    max={max}
                    defaultValue={defaultValue}
                    className={`w-full rounded-lg border ${error
                            ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-gray-800/60 text-red-900 dark:text-red-100 placeholder-red-300 dark:placeholder-red-400'
                            : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/60 text-gray-900 dark:text-white'
                        } ${icon ? 'pl-10' : 'pl-4'
                        } pr-4 py-3 shadow-sm focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200`}
                    whileFocus={{ scale: 1.01 }}
                    required={!optional}
                />

                {error && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}

                <motion.div
                    className="absolute left-0 bottom-0 h-0.5 w-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    whileFocus={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {description && !error && (
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 pl-1">{description}</p>
            )}

            {error && (
                <motion.p
                    className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </motion.p>
            )}
        </div>
    );
}
