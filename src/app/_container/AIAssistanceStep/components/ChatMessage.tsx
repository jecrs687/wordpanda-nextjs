import { motion } from 'framer-motion';
import React from 'react';

interface ChatMessageProps {
    message: {
        id: number;
        text: string;
        isUser: boolean;
    };
    delay: number;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, delay }) => {
    return (
        <motion.div
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${message.isUser
                        ? 'bg-emerald-500 dark:bg-emerald-600 text-white rounded-tr-none'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-none'
                    }`}
            >
                {message.text}
            </div>
        </motion.div>
    );
};
