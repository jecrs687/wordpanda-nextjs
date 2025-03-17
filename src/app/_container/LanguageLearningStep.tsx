import { motion } from 'framer-motion';
import Image from 'next/image';

export default function LanguageLearningStep({ goToStep, windowWidth, windowHeight }) {
    // Language flags animation
    const languageFlags = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'jp', name: 'Japanese' },
        { code: 'de', name: 'German' },
        { code: 'it', name: 'Italian' },
    ];
    return (
        <motion.div
            className="flex flex-col items-center justify-center h-full w-full px-4 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-500/20 to-pink-500/20 z-0"></div>

            {/* Rotating language flags */}
            <div className="w-full max-w-md aspect-square relative mb-5">
                <div className="absolute inset-0 flex items-center justify-center">
                    {languageFlags.map((lang, index) => (
                        <motion.div
                            key={lang.code}
                            className="absolute"
                            initial={{
                                opacity: 0,
                                rotate: index * (360 / languageFlags.length),
                                x: 0,
                                y: -120
                            }}
                            animate={{
                                opacity: 1,
                                rotate: [
                                    index * (360 / languageFlags.length),
                                    index * (360 / languageFlags.length) + 360
                                ],
                                x: [0, 0],
                                y: [-120, -120],
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear",
                                delay: index * 0.5,
                            }}
                        >
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
                                    <Image
                                        src={`/assets/flags/${lang.code}.png`}
                                        alt={lang.name}
                                        width={64}
                                        height={64}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <Image
                        src="/assets/panda-learning.png"
                        alt="Panda Learning"
                        fill
                        className="object-contain"
                    />
                </motion.div>
            </div>

            <motion.div
                className="text-center mt-6 px-6 py-6 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl z-10 max-w-md"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
            >
                <motion.h2
                    className="text-3xl font-bold bg-gradient-to-r from-violet-700 to-indigo-500 bg-clip-text text-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                >
                    Learn Any Language
                </motion.h2>
                <motion.p
                    className="mt-3 text-gray-700 text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                >
                    With customized learning paths, interactive exercises, and real-time feedback, mastering new languages has never been more fun!
                </motion.p>
            </motion.div>

            <motion.button
                className="mt-8 px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full shadow-lg font-medium text-lg"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
                onClick={() => goToStep(3)}
            >
                Next
            </motion.button>
        </motion.div>
    );
}