import { motion } from 'framer-motion';
import React from 'react';

export const TypingIndicator: React.FC = () => {
    const dotVariants = {
        animate: (i: number) => ({
            y: [0, -5, 0],
            transition: {
                delay: i * 0.15,
                duration: 0.6,
                repeat: Infinity,
                ease: "easeInOut"
            }
        })
    };

    return (
        <div className="flex items-center space-x-1 ml-2">
            <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        custom={i}
                        variants={dotVariants}
                        animate="animate"
                        className="w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full"
                    ></motion.div>
                ))}
            </div>
            <span className="ml-1 text-xs text-zinc-600 dark:text-zinc-400">
                AI assistant is typing...
            </span>
        </div>
    );
};
