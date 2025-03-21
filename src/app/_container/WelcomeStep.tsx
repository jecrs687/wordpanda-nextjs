import { motion } from 'framer-motion';
import Image from 'next/image';

export default function WelcomeStep({ goToStep, windowWidth, windowHeight }) {
    return (<motion.div
        className="flex flex-col items-center justify-center h-full w-full px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        <motion.div
            className="relative w-full max-w-md aspect-square"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
        >
            <Image
                src="/assets/welcome-panda.png"
                alt="Welcome to WordPanda"
                fill
                className="object-contain"
                priority
            />
        </motion.div>

        <motion.div
            className="text-center mt-8 px-4 py-6 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
        >
            <motion.h1
                className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
            >
                Welcome to WordPanda!
            </motion.h1>
            <motion.p
                className="mt-4 text-gray-700 text-xl leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
            >
                Ready to revolutionize your language learning journey?
            </motion.p>
        </motion.div>

        <motion.button
            className="mt-8 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white text-lg font-medium rounded-full shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            onClick={() => goToStep(1)}
        >
            {"Let's Start!"}
        </motion.button>
    </motion.div>
    );
}