"use client";

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface BackButtonProps {
    title?: string;
    onClick?: () => void;
    className?: string;
}

const BackButton = ({ title, onClick, className }: BackButtonProps) => {
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleClick = (event: React.MouseEvent) => {
        event.preventDefault();
        if (onClick) {
            onClick();
        } else {
            router.back();
        }
    };

    if (!mounted) return null;

    return (
        <div className={`flex items-center mb-5 ${className || ''}`}>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClick}
                className={`
          flex items-center gap-2 py-2 px-4 rounded-full 
          ${isDark
                        ? 'bg-gray-800 text-white hover:bg-gray-700'
                        : 'bg-white text-gray-800 hover:bg-gray-50'
                    }
          shadow-md border border-gray-200/50 dark:border-gray-700/50
          transition-all duration-300
        `}
                aria-label="Go back"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                    />
                </svg>
                <span className="font-medium">Back</span>
            </motion.button>

            {title && (
                <h1 className={`
          ml-4 text-xl sm:text-2xl font-bold truncate
          ${isDark ? 'text-white' : 'text-gray-900'}
        `}>
                    {title}
                </h1>
            )
            }
        </div >
    );
};

export default BackButton;