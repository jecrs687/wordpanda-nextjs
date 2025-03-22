'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export function WelcomeAnimation() {
    const [showAnimation, setShowAnimation] = useState(true);

    useEffect(() => {
        // Hide the animation after it completes
        const timer = setTimeout(() => {
            setShowAnimation(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    // Don't render anything if the animation is complete
    if (!showAnimation) return null;

    return (
        <motion.div
            className="fixed inset-0 bg-gradient-to-br from-emerald-500/90 to-blue-600/90 dark:from-emerald-900/90 dark:to-blue-900/90 z-50 flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{
                duration: 0.5,
                delay: 2.5,
                ease: "easeInOut"
            }}
            onAnimationComplete={() => setShowAnimation(false)}
        >
            <div className="relative h-40 w-40">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    <Image
                        src="/assets/logo.png"
                        fill
                        alt="WordPanda Logo"
                        className="object-contain"
                        priority
                    />
                </motion.div>

                <motion.div
                    className="absolute inset-0 rounded-full border-t-4 border-white"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 2,
                        ease: "linear",
                        repeat: 1,
                        repeatType: "loop"
                    }}
                />
            </div>

            <motion.h1
                className="absolute mt-48 text-3xl font-bold text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                Welcome to WordPanda
            </motion.h1>

            <motion.p
                className="absolute mt-64 text-white/90 text-center max-w-xs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
            >
                Your journey to language mastery begins now
            </motion.p>
        </motion.div>
    );
}
