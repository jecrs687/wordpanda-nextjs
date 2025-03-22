import { motion } from 'framer-motion';
import React from 'react';

interface AIAssistanceStepProps {
    goToStep: (step: number) => void;
    currentStep: number;
    totalSteps: number;
}

const AIAssistanceStep: React.FC<AIAssistanceStepProps> = ({ goToStep, currentStep }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    // AI chat conversation simulation
    const chatMessages = [
        { id: 1, text: "How do you say 'hello' in Spanish?", isUser: true },
        { id: 2, text: "In Spanish, 'hello' is 'hola'", isUser: false },
        { id: 3, text: "Can you use it in a sentence?", isUser: true }
    ];

    // Pulse animation for AI brain
    const pulseVariants = {
        animate: {
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center md:text-left"
        >
            <motion.div
                variants={itemVariants}
                className="mb-8 mx-auto max-w-md"
            >
                <div className="relative bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-zinc-200/30 dark:border-zinc-700/30 shadow-lg">
                    {/* AI chat simulation */}
                    <div className="flex items-center mb-4 justify-center md:justify-start">
                        <div className="relative mr-3">
                            <motion.div
                                className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center"
                                variants={pulseVariants}
                                animate="animate"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2" />
                                    <path d="M12 12c-1-2.5 0-5.5 4-7" />
                                    <path d="M12 12c1-2.5 0-5.5-4-7" />
                                    <path d="M12 12c-2.5-1-5.5 0-7 4" />
                                    <path d="M12 12c2.5 1 5.5 0 7-4" />
                                </svg>
                            </motion.div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white dark:border-gray-900"></div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-black dark:text-white">PandaAI Assistant</h3>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400">Online • Ready to help</p>
                        </div>
                    </div>

                    {/* Chat messages */}
                    <div className="space-y-3 mb-4">
                        {chatMessages.map((message) => (
                            <motion.div
                                key={message.id}
                                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: message.id * 0.5 }}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${message.isUser
                                            ? 'bg-indigo-500 text-white rounded-tr-none'
                                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-none'
                                        }`}
                                >
                                    {message.text}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Typing indicator */}
                    <motion.div
                        className="flex items-center space-x-1 text-zinc-500 dark:text-zinc-400 text-sm ml-2"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                        <span className="ml-1">AI assistant is typing...</span>
                    </motion.div>
                </div>
            </motion.div>

            <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-4xl font-bold mb-4 text-black dark:text-white"
            >
                AI-Powered <span className="text-cyan-500 dark:text-cyan-400">Learning</span>
            </motion.h2>

            <motion.p
                variants={itemVariants}
                className="text-base md:text-lg text-zinc-700 dark:text-zinc-300 mb-6 max-w-md mx-auto md:mx-0"
            >
                Our intelligent AI assistant guides your learning journey, providing personalized help, answering questions, and adapting to your unique learning style.
            </motion.p>

            <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start"
            >
                <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(6, 182, 212, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => goToStep(currentStep + 1)}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-medium rounded-full 
                             shadow-lg inline-flex items-center justify-center space-x-2"
                >
                    <span>See What's Next</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default AIAssistanceStep;