'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface RegisterHeaderProps {
    currentStep: number;
}

export function RegisterHeader({ currentStep }: RegisterHeaderProps) {
    const headings = [
        "Join WordPanda",
        "Customize Your Learning"
    ];

    const descriptions = [
        "Create your account to start your language learning journey",
        "Tell us your preferences to personalize your experience"
    ];

    return (
        <motion.div
            className="flex flex-col items-center justify-center space-y-4 relative z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="relative">
                <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400/30 via-blue-400/30 to-indigo-400/30 blur-xl transform scale-150"
                    animate={{
                        scale: [1.4, 1.5, 1.4],
                        opacity: [0.4, 0.6, 0.4],
                        rotate: [0, 5, 0]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
                <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    <div className="h-28 w-28 relative">
                        <Image
                            src="/assets/logo.png"
                            fill
                            alt='WordPanda Logo'
                            className="object-contain rounded-xl shadow-md"
                            priority
                        />
                        <motion.div
                            className="absolute h-5 w-5 right-0 bottom-0 bg-emerald-500 rounded-full flex items-center justify-center text-xs text-white font-bold border-2 border-white dark:border-gray-800"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: "spring" }}
                        >
                            {currentStep}
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            <div className="text-center">
                <motion.h1
                    className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight"
                    key={`heading-${currentStep}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 dark:from-emerald-400 dark:via-teal-400 dark:to-blue-500">
                        {headings[currentStep - 1]}
                    </span>
                </motion.h1>

                <motion.p
                    className="mt-2 text-zinc-600 dark:text-zinc-300 text-center max-w-sm"
                    key={`description-${currentStep}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    {descriptions[currentStep - 1]}
                </motion.p>
            </div>
        </motion.div>
    );
}
