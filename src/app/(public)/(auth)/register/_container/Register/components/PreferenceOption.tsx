import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type PreferenceOptionProps = {
    children: ReactNode;
    selected: boolean;
    onClick: () => void;
    description?: string;
    icon?: ReactNode;
};

export function PreferenceOption({
    children,
    selected,
    onClick,
    description,
    icon
}: PreferenceOptionProps) {
    return (
        <motion.div
            role="radio"
            aria-checked={selected}
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
            whileTap={{ scale: 0.98 }}
            className={`
                relative cursor-pointer rounded-lg border-2 p-3 sm:p-4 text-center transition-all duration-200
                ${selected
                    ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}
                focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
            `}
        >
            {/* Content */}
            <div className="flex flex-col items-center">
                {/* Icon if provided */}
                {icon && (
                    <div className={`text-lg mb-2 ${selected
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                        {icon}
                    </div>
                )}

                <div className={`font-medium ${selected
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-gray-800 dark:text-gray-200'
                    }`}>
                    {children}
                </div>

                {/* Optional description */}
                {description && (
                    <div className={`text-xs mt-1 ${selected
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                        {description}
                    </div>
                )}
            </div>

            {/* Selected indicator - simpler and clearer */}
            {selected && (
                <div className="absolute top-0 right-0 -mt-2 -mr-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                    <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
            )}
        </motion.div>
    );
}
