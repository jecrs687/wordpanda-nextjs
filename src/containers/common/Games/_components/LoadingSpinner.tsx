'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

type LoadingSpinnerProps = {
    text?: string;
    size?: 'sm' | 'md' | 'lg';
};

const LoadingSpinner = ({ text = 'Loading...', size = 'md' }: LoadingSpinnerProps) => {
    const sizeClasses = {
        sm: 'h-5 w-5',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            >
                <Loader2 className={`${sizeClasses[size]} text-emerald-500 dark:text-emerald-400`} />
            </motion.div>
            <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">{text}</p>
        </div>
    );
};

export default LoadingSpinner;
