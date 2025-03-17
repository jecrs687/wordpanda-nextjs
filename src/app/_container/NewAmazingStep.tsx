import { motion } from 'framer-motion';
import Image from 'next/image';

export default function NewAmazingStep({ goToStep, windowWidth, windowHeight }) {
    const features = [
        {
            icon: "🔥",
            text: "Daily Streaks"
        },
        {
            icon: "🏆",
            text: "Leaderboards"
        },
        {
            icon: "🎮",
            text: "Language Games"
        },
        {
            icon: "🎯",
            text: "Goal Setting"
        }
    ];

    return (
        <motion.div
            className="flex flex-col items-center justify-center h-full w-full px-5 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute top-1/4 -left-20 w-60 h-60 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 opacity-20 blur-3xl"
                    animate={{
                        x: [0, 40, 0],
                        y: [0, -20, 0],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 8,
                        repeatType: "reverse"
                    }}
                />
                <motion.div
                    className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 opacity-20 blur-3xl"
                    animate={{
                        x: [0, -30, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 10,
                        repeatType: "reverse"
                    }}
                />
            </div>

            {/* Title with staggered animation */}
            <motion.div
                className="text-center mb-6 z-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <motion.h1
                    className="text-4xl md:text-5xl font-black"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <motion.span className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Gamify
                    </motion.span>
                    <motion.span className="ml-2 text-gray-800">
                        Your Learning
                    </motion.span>
                </motion.h1>
            </motion.div>

            {/* 3D phone mockup */}
            <motion.div
                className="relative w-60 h-80 md:w-72 md:h-96 mb-6"
                initial={{ opacity: 0, rotateY: 25 }}
                animate={{ opacity: 1, rotateY: 0 }}
                transition={{ duration: 1, delay: 0.5, type: "spring" }}
                style={{ perspective: "1000px" }}
            >
                <div className="relative w-full h-full rounded-[2.5rem] border-8 border-gray-800 overflow-hidden shadow-xl"
                    style={{ transformStyle: "preserve-3d" }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500">
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                            <Image
                                src="/assets/panda-app.png"
                                alt="WordPanda App"
                                width={180}
                                height={180}
                                className="mb-4"
                            />

                            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl w-full">
                                <h3 className="font-bold text-lg text-gray-800 mb-2">WordPanda Pro</h3>
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-600">Daily Goal</div>
                                    <div className="text-sm font-medium text-indigo-600">8/10 words</div>
                                </div>
                                <div className="mt-1 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "80%" }}
                                        transition={{ delay: 1.2, duration: 0.8 }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-5 bg-gray-800 rounded-b-lg z-20"></div>
            </motion.div>

            {/* Features grid */}
            <motion.div
                className="grid grid-cols-2 gap-3 max-w-xs z-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
            >
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        className="bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-lg text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 + index * 0.15, duration: 0.5 }}
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.9)" }}
                    >
                        <div className="text-2xl mb-1">{feature.icon}</div>
                        <div className="font-medium text-gray-800">{feature.text}</div>
                    </motion.div>
                ))}
            </motion.div>

            <motion.button
                className="mt-6 px-8 py-3.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full shadow-lg font-medium text-lg"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(219, 39, 119, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                onClick={() => goToStep(5)}
            >
                Let's Get Started!
            </motion.button>
        </motion.div>
    );
}
