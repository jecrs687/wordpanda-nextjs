import { motion } from "framer-motion";

export const LoadingGames = ({ text }: { text?: string }) => (
    <div className="flex flex-col items-center justify-center h-[60vh]">
        <motion.div
            animate={{
                rotate: 360,
                borderRadius: ["50% 50% 50% 50%", "40% 60% 60% 40%", "50% 50% 50% 50%"],
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full"
        />
        <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">{text || "Loading game"}</p>
    </div>
);