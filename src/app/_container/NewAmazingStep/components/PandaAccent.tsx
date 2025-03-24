import { motion } from 'framer-motion';

const PandaAccent = () => {
    return (
        <>
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Circular elements - hidden on very small screens */}
                <motion.div
                    className="absolute -top-10 -left-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black dark:bg-white opacity-10 hidden xs:block"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.1 }}
                    transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
                />

                <motion.div
                    className="absolute -top-10 -right-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black dark:bg-white opacity-10 hidden xs:block"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.1 }}
                    transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                />

                {/* Larger floating circles - reduced size on mobile */}
                <motion.div
                    className="absolute top-1/2 -left-12 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-black dark:bg-white opacity-5 hidden sm:block"
                    animate={{
                        y: [0, -15, 0],
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 6,
                        ease: "easeInOut"
                    }}
                />

                <motion.div
                    className="absolute bottom-20 -right-8 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-black dark:bg-white opacity-5 hidden sm:block"
                    animate={{
                        y: [0, 10, 0],
                        scale: [1, 1.03, 1],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 7,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />

                {/* Bamboo-inspired lines - thinner on mobile */}
                <motion.div
                    className="absolute -bottom-4 left-1/4 h-12 sm:h-16 w-0.5 sm:w-1 bg-emerald-500 dark:bg-emerald-400 rounded-full opacity-10"
                    animate={{ height: [30, 50, 30] }}
                    transition={{
                        repeat: Infinity,
                        duration: 8,
                        ease: "easeInOut"
                    }}
                />

                <motion.div
                    className="absolute -bottom-4 left-1/4 translate-x-2 sm:translate-x-3 h-8 sm:h-12 w-0.5 sm:w-1 bg-emerald-500 dark:bg-emerald-400 rounded-full opacity-10"
                    animate={{ height: [20, 35, 20] }}
                    transition={{
                        repeat: Infinity,
                        duration: 8,
                        ease: "easeInOut",
                        delay: 0.5
                    }}
                />

                <motion.div
                    className="absolute -bottom-4 right-1/4 h-12 sm:h-16 w-0.5 sm:w-1 bg-emerald-500 dark:bg-emerald-400 rounded-full opacity-10"
                    animate={{ height: [30, 50, 30] }}
                    transition={{
                        repeat: Infinity,
                        duration: 7,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />

                <motion.div
                    className="absolute -bottom-4 right-1/4 -translate-x-2 sm:-translate-x-3 h-8 sm:h-12 w-0.5 sm:w-1 bg-emerald-500 dark:bg-emerald-400 rounded-full opacity-10"
                    animate={{ height: [20, 35, 20] }}
                    transition={{
                        repeat: Infinity,
                        duration: 7,
                        ease: "easeInOut",
                        delay: 1.5
                    }}
                />
            </div>
        </>
    );
};

export default PandaAccent;
