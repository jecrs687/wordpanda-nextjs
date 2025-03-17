import { motion } from 'framer-motion';
import Image from 'next/image';

export default function PandaEatingStep({ goToStep, windowWidth, windowHeight }) {
    const wordVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.3 * i,
                duration: 0.5,
            }
        })
    };

    return (<motion.div
        className="flex flex-col items-center justify-center h-full w-full px-6 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        <div className="absolute inset-0 overflow-hidden z-0">
            {['Hola', 'Hello', 'Bonjour', '你好', 'Ciao', 'Olá', 'こんにちは', 'Привет', 'مرحبا', 'Hallo'].map((word, i) => (
                <motion.div
                    key={i}
                    className="absolute text-xl md:text-2xl font-bold text-purple-300/60"
                    style={{
                        left: `${Math.random() * 80 + 5}%`,
                        top: `${Math.random() * 80 + 5}%`,
                    }}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={wordVariants}
                >
                    {word}
                </motion.div>
            ))}
        </div>

        {/* Main content */}
        <motion.div
            className="relative z-10 flex flex-col items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
        >
            <div className="relative w-64 h-64 mb-6">
                <motion.div
                    initial={{ rotate: -5 }}
                    animate={{ rotate: 5 }}
                    transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
                >
                    <Image
                        src="/assets/panda-eating.png"
                        alt="Panda Eating Words"
                        fill
                        className="object-contain"
                    />
                </motion.div>
            </div>
        </motion.div>

        <motion.div
            className="text-center mt-4 px-5 py-6 bg-gradient-to-br from-purple-900/90 to-indigo-900/90 text-white rounded-2xl shadow-xl z-10 max-w-md"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
        >
            <motion.h2
                className="text-3xl font-bold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
            >
                Feed Your Vocabulary
            </motion.h2>
            <motion.p
                className="mt-3 text-gray-100 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
            >
                Just like pandas eat bamboo, WordPanda helps you digest new words and phrases effortlessly!
            </motion.p>
        </motion.div>

        <motion.button
            className="mt-8 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full shadow-lg font-medium text-lg"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            onClick={() => goToStep(2)}
        >
            Continue
        </motion.button>
    </motion.div>
    );
}