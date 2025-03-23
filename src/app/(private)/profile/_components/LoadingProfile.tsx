"use client";
import { motion } from 'framer-motion';

export default function LoadingProfile() {
    return (
        <div className="w-full py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-center space-y-6">
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.7, 1, 0.7]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="w-24 h-24 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                    />

                    <div className="w-full max-w-3xl space-y-4">
                        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-3/4 animate-pulse" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-20 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
