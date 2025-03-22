import { motion } from 'framer-motion';

interface PreferenceOptionProps {
    icon: string;
    label: string;
    description: string;
    selected: boolean;
    onClick: () => void;
}

export const PreferenceOption = ({
    icon,
    label,
    description,
    selected,
    onClick,
}: PreferenceOptionProps) => {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
                relative flex flex-col items-start p-4 rounded-lg transition-all duration-200 text-left h-full w-full
                ${selected
                    ? 'bg-black/5 border-2 border-black dark:bg-white/10 dark:border-white shadow-sm'
                    : 'bg-zinc-50 border-2 border-transparent hover:border-zinc-200 dark:bg-zinc-800/60 dark:hover:border-zinc-700'
                }
            `}
        >
            <span className="text-2xl mb-2">{icon}</span>
            <span className={`
                font-bold text-base md:text-lg mb-1
                ${selected
                    ? 'text-black dark:text-white'
                    : 'text-zinc-800 dark:text-white'
                }
            `}>
                {label}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                {description}
            </span>

            {selected && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 bg-black dark:bg-white rounded-full p-1"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white dark:text-black"
                    >
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </motion.div>
            )}
        </motion.button>
    );
};
