import { motion } from 'framer-motion';
import React, { useState } from 'react';

interface StoryNavigationProps {
    handleNext: () => void;
    handlePrev: () => void;
}

export const StoryNavigation: React.FC<StoryNavigationProps> = ({
    handleNext,
    handlePrev,
}) => {
    const [showLeftIndicator, setShowLeftIndicator] = useState(false);
    const [showRightIndicator, setShowRightIndicator] = useState(false);

    return (
        <>
            <div
                className="absolute top-0 left-0 h-full w-1/4 z-10 cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                }}
                onMouseEnter={() => setShowLeftIndicator(true)}
                onMouseLeave={() => setShowLeftIndicator(false)}
                onTouchStart={() => setShowLeftIndicator(true)}
                onTouchEnd={() => setShowLeftIndicator(false)}
            >
                <motion.div
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 
                              rounded-full bg-black/10 dark:bg-white/10 backdrop-blur-md
                              flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showLeftIndicator ? 0.8 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-black dark:text-white"
                    >
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </motion.div>
            </div>

            <div
                className="absolute top-0 right-0 h-full w-1/4 z-10 cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                }}
                onMouseEnter={() => setShowRightIndicator(true)}
                onMouseLeave={() => setShowRightIndicator(false)}
                onTouchStart={() => setShowRightIndicator(true)}
                onTouchEnd={() => setShowRightIndicator(false)}
            >
                <motion.div
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 
                              rounded-full bg-black/10 dark:bg-white/10 backdrop-blur-md
                              flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showRightIndicator ? 0.8 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-black dark:text-white"
                    >
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </motion.div>
            </div>
        </>
    );
};
