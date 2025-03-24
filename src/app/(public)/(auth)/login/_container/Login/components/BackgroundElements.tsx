import { motion } from "framer-motion";
import { useId } from "react";

export const BackgroundElements = () => {
    // Use useId to generate stable keys for the stars
    const id = useId();

    // Pre-generate random positions for stars to avoid re-renders
    const starPositions = Array.from({ length: 15 }, () => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${3 + Math.random() * 4}s`,
        opacity: 0.2 + Math.random() * 0.5
    }));

    return (
        <>
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Panda-inspired subtle background patterns */}
                <motion.div
                    className="absolute -top-48 -right-48 w-80 h-80 bg-black/5 dark:bg-white/5 rounded-full filter blur-3xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute top-1/4 right-1/4 w-72 h-72 bg-black/5 dark:bg-white/5 rounded-full filter blur-3xl"
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                />
                <motion.div
                    className="absolute -bottom-48 -left-48 w-80 h-80 bg-black/5 dark:bg-white/5 rounded-full filter blur-3xl"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
                />

                {/* Bamboo leaves - simplified version with static paths instead of animated paths */}
                <div className="absolute top-20 left-10 opacity-10 dark:opacity-20">
                    <motion.svg
                        width="120"
                        height="120"
                        viewBox="0 0 120 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        animate={{ rotate: [0, 2, -2, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <path
                            d="M60 10C60 10 30 40 30 70C30 100 60 110 60 110"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-emerald-800 dark:text-emerald-500"
                        />
                        <path
                            d="M60 10C60 10 90 40 90 70C90 100 60 110 60 110"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-emerald-800 dark:text-emerald-500"
                        />
                    </motion.svg>
                </div>

                <div className="absolute bottom-20 right-10 opacity-10 dark:opacity-20">
                    <motion.svg
                        width="100"
                        height="100"
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        animate={{ rotate: [0, -2, 2, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <path
                            d="M50 10C50 10 20 40 20 70C20 100 50 90 50 90"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="text-emerald-800 dark:text-emerald-500"
                        />
                    </motion.svg>
                </div>
            </div>

            {/* Subtle stars for dark mode */}
            <div className="hidden dark:block absolute inset-0 z-0">
                {starPositions.map((pos, i) => (
                    <div
                        key={`${id}-star-${i}`}
                        className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                        style={{
                            top: pos.top,
                            left: pos.left,
                            animationDelay: pos.delay,
                            animationDuration: pos.duration,
                            opacity: pos.opacity
                        }}
                    />
                ))}
            </div>
        </>
    );
};
