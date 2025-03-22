import { cn } from '@utils/utils';
import { ReactNode } from 'react';

interface LandingContainerProps {
    children: ReactNode;
    isDarkMode: boolean;
}

export function LandingContainer({ children, isDarkMode }: LandingContainerProps) {
    return (
        <div className={cn(
            "relative h-screen w-full overflow-hidden transition-colors duration-500",
            isDarkMode
                ? "bg-black text-white"
                : "bg-white text-zinc-900"
        )}>
            {children}
        </div>
    );
}
