import React from 'react';

interface StoryContainerProps {
    children: React.ReactNode;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
    onClick: (e: React.MouseEvent) => void;
}

export const StoryContainer: React.FC<StoryContainerProps> = ({
    children,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onClick,
}) => {
    return (
        <div
            className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100 
                     dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onClick={onClick}
        >
            {children}
        </div>
    );
};
