import { motion } from 'framer-motion';
import React from 'react';

interface StoryBackgroundProps {
    isDarkMode: boolean;
}

export const StoryBackground: React.FC<StoryBackgroundProps> = ({ isDarkMode }) => {
    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
            {/* Gradient background */}
            <div className={`absolute inset-0 ${isDarkMode
                    ? 'bg-gradient-to-br from-gray-950 via-gray-950/95 to-gray-950 bg-blend-overlay'
                    : 'bg-gradient-to-br from-white via-zinc-50/90 to-white bg-blend-overlay'
                }`} />

            {/* Bamboo-inspired pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute h-full w-8 left-[15%] bg-black dark:bg-white rounded-full" />
                <div className="absolute h-full w-6 left-[25%] bg-black dark:bg-white rounded-full" />
                <div className="absolute h-full w-10 left-[60%] bg-black dark:bg-white rounded-full" />
                <div className="absolute h-full w-4 left-[80%] bg-black dark:bg-white rounded-full" />
            </div>

            {/* Panda spots pattern (subtle) */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                <div className="absolute top-[10%] left-[10%] w-32 h-32 rounded-full bg-black dark:bg-white" />
                <div className="absolute bottom-[20%] right-[10%] w-48 h-48 rounded-full bg-black dark:bg-white" />
                <div className="absolute top-[40%] right-[25%] w-24 h-24 rounded-full bg-black dark:bg-white" />
                <div className="absolute bottom-[30%] left-[20%] w-36 h-36 rounded-full bg-black dark:bg-white" />
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={`absolute w-3 h-3 rounded-full ${isDarkMode ? 'bg-gray-800/40' : 'bg-zinc-200/60'
                            } backdrop-blur-sm`}
                        initial={{
                            x: `${Math.random() * 100}%`,
                            y: `${Math.random() * 100}%`,
                            scale: 0.8,
                            opacity: 0.4
                        }}
                        animate={{
                            x: `${Math.random() * 100}%`,
                            y: `${Math.random() * 100}%`,
                            scale: [0.8, 1.2, 0.8],
                            opacity: [0.4, 0.7, 0.4]
                        }}
                        transition={{
                            duration: 15 + Math.random() * 20,
                            repeat: Infinity,
                            repeatType: 'mirror',
                            ease: 'easeInOut'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};
