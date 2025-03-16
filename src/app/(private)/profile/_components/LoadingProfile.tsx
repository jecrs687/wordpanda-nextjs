import { motion } from 'framer-motion';

export default function LoadingProfile() {
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <div className="text-center">
                <motion.div
                    className="w-16 h-16 border-4 border-emerald-400 dark:border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <motion.p
                    className="text-zinc-600 dark:text-zinc-300 font-medium text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Carregando seu perfil...
                </motion.p>
            </div>
        </div>
    );
}
