"use client";
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type ShowIfProps = {
    condition: boolean;
    children: ReactNode;
    animation?: boolean;
};

export const ShowIf = ({ condition, children, animation = true }: ShowIfProps) => {
    if (!condition) return null;

    if (animation) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {children}
            </motion.div>
        );
    }

    return <>{children}</>;
};
