import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import React from 'react';

interface StoryHeaderProps {
    statusBarHeight: number;
    isDarkMode: boolean;
}

export const StoryHeader: React.FC<StoryHeaderProps> = ({ statusBarHeight, isDarkMode }) => {
    const { setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(isDarkMode ? 'light' : 'dark');
    };

    return (
        <div
            className="absolute top-0 left-0 w-full z-20 px-4 flex items-center justify-between"
            style={{ paddingTop: `${statusBarHeight + 18}px`, height: `${statusBarHeight + 60}px` }}
        >
            <motion.div
                className="flex items-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <div className="font-bold text-xl text-black dark:text-white flex items-center">
                    <span className="relative mr-2 w-8 h-8">
                        {/* Panda icon with ears */}
                        <span className="absolute bg-black dark:bg-white w-7 h-7 rounded-full top-1 left-0.5 flex items-center justify-center overflow-hidden">
                            <span className={`text-lg ${isDarkMode ? 'text-black' : 'text-white'}`}>
                                🐼
                            </span>
                        </span>
                        <span className="absolute w-2.5 h-2.5 bg-black dark:bg-white rounded-full -top-0.5 -left-0.5"></span>
                        <span className="absolute w-2.5 h-2.5 bg-black dark:bg-white rounded-full -top-0.5 right-0"></span>
                    </span>
                    <span className="font-black tracking-tight">WordPanda</span>
                </div>
            </motion.div>

            {/* Theme toggler */}
            <motion.button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                {isDarkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                )}
            </motion.button>
        </div>
    );
};
