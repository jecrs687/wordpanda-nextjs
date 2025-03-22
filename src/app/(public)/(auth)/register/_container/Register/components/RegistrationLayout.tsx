"use client";
import { useMediaQuery } from '@hooks/useMediaQuery';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { ReactNode, useEffect, useState } from 'react';

type RegistrationLayoutProps = {
    children: ReactNode;
};

export function RegistrationLayout({ children }: RegistrationLayoutProps) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const prefersReducedMotion = useReducedMotion();
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Track mouse movement for subtle parallax effect (only on desktop)
    useEffect(() => {
        if (prefersReducedMotion || isMobile) return;

        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [prefersReducedMotion, isMobile]);

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-50 dark:bg-slate-900">
            {/* Simple, subtle background pattern */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-50">
                <div className="absolute inset-0 bg-grid" />
            </div>

            {/* Card container with clean, high-contrast design */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl z-10 bg-white dark:bg-gray-800 rounded-xl overflow-hidden"
                style={{
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                }}
            >
                <div className="relative w-full h-full">
                    {/* Simple border accent */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-emerald-500" />

                    <div className="relative flex flex-col">
                        {/* Logo area with high contrast background for black logo */}
                        <div className="flex justify-center pt-8 pb-4 bg-white dark:bg-gray-800">
                            <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-white dark:bg-white rounded-full">
                                <Image
                                    src="/assets/logo.png"
                                    width={isMobile ? 60 : 75}
                                    height={isMobile ? 60 : 75}
                                    alt="WordPanda Logo"
                                    className="relative z-10"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Content area with clean styling */}
                        <div className="flex-1 p-6 md:p-8">
                            {children}
                        </div>
                    </div>
                </div>
            </motion.div >

            {/* Accessibility skip link */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white dark:bg-gray-800 px-4 py-2 z-50 text-emerald-600 dark:text-emerald-400 rounded-md shadow-md"
            >
                Skip to main content
            </a>
        </div >
    );
}
