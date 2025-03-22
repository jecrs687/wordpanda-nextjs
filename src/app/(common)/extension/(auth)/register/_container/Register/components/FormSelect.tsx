'use client';
import { motion } from 'framer-motion';

interface Option {
    value: string;
    label: string;
}

interface FormSelectProps {
    name: string;
    title: string;
    options: Option[];
    error?: string;
    optional?: boolean;
    icon?: string;
}

export function FormSelect({
    name,
    title,
    options,
    error,
    optional = false,
    icon
}: FormSelectProps) {
    const renderIcon = () => {
        switch (icon) {
            case 'calendar':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                );
            case 'brain':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                );
            case 'chart':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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

                <motion.select
                    id={name}
                    name={name}
                    className={`w-full rounded-lg border ${error
                            ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-gray-800/60 text-red-900 dark:text-red-100 placeholder-red-300 dark:placeholder-red-400'
                            : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/60 text-gray-900 dark:text-white'
                        } ${icon ? 'pl-10' : 'pl-4'
                        } pr-10 py-3 shadow-sm focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200 appearance-none`}
                    whileFocus={{ scale: 1.01 }}
                    required={!optional}
                >
                    <option value="" disabled selected>Select {title}</option>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </motion.select>

                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 dark:text-gray-500">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>

                {error && (
                    <div className="absolute inset-y-0 right-0 pr-8 flex items-center pointer-events-none">
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
