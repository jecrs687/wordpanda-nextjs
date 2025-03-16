"use client";
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type AnimationVariant = 'fade' | 'slideUp' | 'slideDown' | 'scale' | 'fadeSlide';

type ShowIfProps = {
    condition: boolean;
    children: ReactNode;
    animation?: boolean;
    variant?: AnimationVariant;
    duration?: number;
    className?: string;
    preserveSpace?: boolean;
};

export const ShowIf = ({
    condition,
    children,
    animation = true,
    variant = 'fade',
    duration = 0.3,
    className = '',
    preserveSpace = false
}: ShowIfProps) => {
    if (!condition && !preserveSpace) return null;

    const variants = {
        fade: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
        },
        slideUp: {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: 20 },
        },
        slideDown: {
            initial: { opacity: 0, y: -20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
        },
        scale: {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.95 },
        },
        fadeSlide: {
            initial: { opacity: 0, x: -20 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -20 },
        },
    };

    if (!condition && preserveSpace) {
        return <div className={className} style={{ visibility: 'hidden' }}>{children}</div>;
    }

    if (animation) {
        const selectedVariant = variants[variant];
        return (
            <motion.div
                initial={selectedVariant.initial}
                animate={selectedVariant.animate}
                exit={selectedVariant.exit}
                transition={{ duration, ease: 'easeInOut' }}
                className={className}
            >
                {children}
            </motion.div>
        );
    }

    return <div className={className}>{children}</div>;
};
