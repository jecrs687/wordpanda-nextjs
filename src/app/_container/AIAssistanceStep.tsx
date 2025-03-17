import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

export default function AIAssistanceStep({ goToStep, windowWidth, windowHeight }) {
    const [showResponse, setShowResponse] = useState(false);

    // Mock chat messages
    const chatMessages = [
        { text: "How do you say 'I love learning' in Spanish?", user: true },
        { text: "Me encanta aprender", user: false },
        { text: "Can you give me more context?", user: true },
    ];

    const responseMessage = "In Spanish, 'I love learning' translates to 'Me encanta aprender'. You could also say 'Me encanta estudiar' (I love studying) or 'Me encanta aprender idiomas' (I love learning languages).";

    return (
        <motion.div
            className="flex flex-col items-center justify-center h-full w-full px-4 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 z-0"></div>
            <motion.div
                className="absolute top-0 right-0 w-72 h-72 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 opacity-20 blur-3xl"
                animate={{
                    x: [10, -10, 10],
                    y: [10, -10, 10],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            />
            <motion.div
                className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 opacity-20 blur-3xl"
                animate={{
                    x: [-10, 10, -10],
                    y: [-10, 10, -10],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            />

            {/* AI Assistant mockup */}
            <motion.div
                className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
            >
                {/* Chat header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 flex items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white mr-3">
                        <Image
                            src="/assets/panda-ai.png"
                            alt="AI Panda"
                            width={32}
                            height={32}
                            className="object-cover"
                        />
                    </div>
                    <h3 className="text-white font-medium">WordPanda Assistant</h3>
                    <div className="ml-auto flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        <p className="text-green-100 text-xs">Online</p>
                    </div>
                </div>

                {/* Chat messages */}
                <div className="p-4 h-60 overflow-y-auto bg-gray-50">
                    {chatMessages.map((message, index) => (
                        <motion.div
                            key={index}
                            className={`flex ${message.user ? 'justify-end' : 'justify-start'} mb-3`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.3 + 0.5, duration: 0.5 }}
                        >
                            <div
                                className={`max-w-[80%] px-4 py-2 rounded-2xl ${message.user
                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                                        : 'bg-white border border-gray-200 text-gray-700'
                                    }`}
                            >
                                {message.text}
                            </div>
                        </motion.div>
                    ))}

                    {/* Typing indicator and AI response */}
                    <motion.div
                        className="flex justify-start mb-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                    >
                        {!showResponse ? (
                            <motion.div
                                className="bg-white border border-gray-200 px-4 py-3 rounded-2xl"
                                initial={{ opacity: 1 }}
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                onAnimationComplete={() => {
                                    setTimeout(() => setShowResponse(true), 1500);
                                }}
                            >
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                className="bg-white border border-gray-200 px-4 py-2 rounded-2xl text-gray-700"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                {responseMessage}
                            </motion.div>
                        )}
                    </motion.div>
                </div>

                {/* Chat input */}
                <div className="p-3 bg-white border-t flex items-center">
                    <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-400">
                        Ask anything about languages...
                    </div>
                    <button className="ml-2 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-600 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </motion.div>

            <motion.div
                className="text-center mt-6 px-5 py-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg max-w-md z-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
            >
                <motion.h2
                    className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                >
                    AI-Powered Language Assistant
                </motion.h2>
                <motion.p
                    className="mt-2 text-gray-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                >
                    Get instant translations, practice conversations, and receive personalized feedback anytime!
                </motion.p>
            </motion.div>

            <motion.button
                className="mt-6 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg font-medium text-lg"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.7 }}
                onClick={() => goToStep(4)}
            >
                Amazing!
            </motion.button>
        </motion.div>
    );
}