import { motion } from 'framer-motion';
import { Loader2, PawPrint } from 'lucide-react';

export const LoadingGames = () => {
    return (
        <div className="h-full w-full flex items-center justify-center">
            <div className="flex flex-col items-center">
                <div className="relative mb-4">
                    <PawPrint className="h-12 w-12 text-emerald-500 dark:text-emerald-400" />
                    <motion.div
                        className="absolute inset-0"
                        animate={{
                            rotate: 360,
                            opacity: [0.2, 0.8, 0.2]
                        }}
                        transition={{
                            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                            opacity: { duration: 1.5, repeat: Infinity }
                        }}
                    >
                        <Loader2 className="h-12 w-12 text-emerald-500/30 dark:text-emerald-400/30" />
                    </motion.div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                    Loading game...
                </p>
            </div>
        </div>
    );
};