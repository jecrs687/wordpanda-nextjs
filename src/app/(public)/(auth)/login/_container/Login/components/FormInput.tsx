import { Input, Label } from '@core/ui';
import { AnimatePresence, motion } from "framer-motion";
import { useState } from 'react';

interface FormInputProps {
    type: string;
    name: string;
    title: string;
    placeholder?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const FormInput = ({
    type,
    name,
    title,
    placeholder,
    error,
    icon,
}: FormInputProps) => {
    const [focused, setFocused] = useState(false);

    return (
        <div className="space-y-2">
            <Label
                htmlFor={name}
                className="flex items-center text-sm font-medium text-zinc-800 dark:text-zinc-200"
            >
                {icon && <span className="mr-2">{icon}</span>}
                {title}
            </Label>
            <div className="relative">
                <motion.div
                    animate={{
                        scale: focused ? 1.01 : 1,
                        borderColor: focused ? 'rgb(16, 185, 129)' : 'transparent',
                    }}
                    className="rounded-lg overflow-hidden"
                >
                    <Input
                        type={type}
                        id={name}
                        name={name}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        className={`w-full px-3 py-2.5 bg-white dark:bg-zinc-800 border ${error
                            ? 'border-red-500 ring-1 ring-red-500'
                            : focused
                                ? 'border-emerald-500 ring-1 ring-emerald-500'
                                : 'border-zinc-300 dark:border-zinc-700'
                            } rounded-lg text-zinc-900 dark:text-white transition-all duration-200`}
                        placeholder={placeholder}
                        aria-invalid={error ? "true" : "false"}
                        aria-describedby={error ? `${name}-error` : undefined}
                    />
                </motion.div>
                <AnimatePresence>
                    {error && (
                        <motion.p
                            id={`${name}-error`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute text-xs font-medium text-red-500 mt-1"
                        >
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
