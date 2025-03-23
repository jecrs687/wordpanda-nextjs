'use client';

import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

type QuizOptionProps = {
    option: string;
    index: number;
    selected?: boolean;
    correct?: boolean;
    incorrect?: boolean;
    disabled?: boolean;
    onClick: () => void;
};

const QuizOption = ({
    option,
    index,
    selected = false,
    correct,
    incorrect,
    disabled = false,
    onClick
}: QuizOptionProps) => {
    // Get style based on state
    const getOptionStyle = () => {
        if (correct) {
            return 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-500 dark:border-emerald-600 text-emerald-700 dark:text-emerald-300';
        }
        if (incorrect) {
            return 'bg-rose-100 dark:bg-rose-900/30 border-rose-500 dark:border-rose-600 text-rose-700 dark:text-rose-300';
        }
        if (selected) {
            return 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-500 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300';
        }
        return 'bg-white dark:bg-gray-800/75 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50';
    };

    // Option letter (A, B, C, D)
    const optionLetter = String.fromCharCode(65 + index);

    return (
        <motion.button
            className={`w-full p-3 rounded-lg border-2 text-left transition-colors flex items-center gap-3 ${getOptionStyle()} ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
            onClick={!disabled ? onClick : undefined}
            whileHover={!disabled ? { scale: 1.01 } : {}}
            whileTap={!disabled ? { scale: 0.99 } : {}}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-medium text-sm ${selected || correct || incorrect ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                {correct ? (
                    <CheckCircle className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                ) : incorrect ? (
                    <XCircle className="h-4 w-4 text-rose-500 dark:text-rose-400" />
                ) : (
                    optionLetter
                )}
            </div>

            <span className="font-medium">{option}</span>
        </motion.button>
    );
};

export default QuizOption;
