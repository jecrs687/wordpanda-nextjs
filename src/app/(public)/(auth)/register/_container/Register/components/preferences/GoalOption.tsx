import { motion } from 'framer-motion';

interface GoalOptionProps {
    value: number;
    label: string;
    description: string;
    selected: boolean;
    onClick: () => void;
}

export const GoalOption = ({ value, label, description, selected, onClick }: GoalOptionProps) => {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
                flex flex-col items-center justify-center py-3 px-2 rounded-lg transition-all duration-200
                ${selected
                    ? 'bg-black/5 border-2 border-black dark:bg-white/10 dark:border-white shadow-sm'
                    : 'bg-zinc-50 border-2 border-transparent hover:border-zinc-200 dark:bg-zinc-800/60 dark:hover:border-zinc-700'
                }
            `}
        >
            <span className={`
                text-base md:text-lg font-bold
                ${selected
                    ? 'text-black dark:text-white'
                    : 'text-zinc-700 dark:text-zinc-300'
                }
            `}>
                {label}
            </span>
            <span className="text-xs mt-1 text-zinc-500 dark:text-zinc-400 line-clamp-1">
                {description}
            </span>
        </motion.button>
    );
};
