import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { ReactNode } from 'react';

interface StepTransitionProps {
    children: ReactNode;
    className?: string;
}

const variants = {
    enter: {
        opacity: 0,
        y: 20,
        scale: 0.98
    },
    center: {
        opacity: 1,
        y: 0,
        scale: 1
    },
    exit: {
        opacity: 0,
        y: -20,
        scale: 0.98
    }
};

export default function StepTransition({ children, className }: StepTransitionProps) {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    return (
        <motion.div
            initial="enter"
            animate="center"
            exit="exit"
            variants={variants}
            transition={{
                type: "spring",
                stiffness: 350,
                damping: 30,
                opacity: { duration: 0.4 }
            }}
            className={cn(
                "w-full h-full flex flex-col items-center justify-center p-6 md:p-10",
                className
            )}
            style={{
                boxShadow: isDark
                    ? 'inset 0 0 80px rgba(0, 0, 0, 0.2)'
                    : 'inset 0 0 80px rgba(0, 0, 0, 0.03)'
            }}
        >
            {children}
        </motion.div>
    );
}
