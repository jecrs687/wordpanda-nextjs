import { motion } from 'framer-motion';
import React from 'react';
import { ChatMessage } from './components/ChatMessage';
import { PandaAssistant } from './components/PandaAssistant';
import { TypingIndicator } from './components/TypingIndicator';

interface AIAssistanceStepProps {
    goToStep: (step: number) => void;
    currentStep: number;
    totalSteps: number;
}

const AIAssistanceStep: React.FC<AIAssistanceStepProps> = ({ goToStep, currentStep, totalSteps }) => {
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
        { id: 3, text: "Can you use it in a sentence?", isUser: true },
        { id: 4, text: "Sure! 'Hola, ¿cómo estás?' means 'Hello, how are you?'", isUser: false }
    ];

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="px-4 sm:px-6 text-center md:text-left max-w-3xl mx-auto"
        >
            <motion.div
                variants={itemVariants}
                className="mb-6 sm:mb-8 mx-auto max-w-md"
            >
                <div className="relative bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-3 sm:p-4 
                               border border-black/5 dark:border-white/5 shadow-xl overflow-hidden">
                    {/* Subtle panda pattern background */}
                    <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,black_1px,transparent_1px)] 
                                  bg-[size:12px_12px] dark:bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)]"></div>

                    <PandaAssistant />

                    {/* Chat messages */}
                    <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 max-h-[150px] sm:max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 px-1">
                        {chatMessages.map((message) => (
                            <ChatMessage
                                key={message.id}
                                message={message}
                                delay={message.id * 0.3}
                            />
                        ))}
                    </div>

                    <TypingIndicator />
                </div>
            </motion.div>

            <motion.div className="flex flex-col items-center md:items-start space-y-4 sm:space-y-6">
                <motion.h2
                    variants={itemVariants}
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-black dark:text-white"
                >
                    <span className="relative">
                        <span className="relative z-10">Panda</span>
                        <motion.span
                            className="absolute -bottom-1 left-0 right-0 h-3 bg-black dark:bg-white opacity-10 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ delay: 1, duration: 0.5 }}
                        />
                    </span>{' '}
                    <span className="text-emerald-600 dark:text-emerald-400">AI Assistant</span>
                </motion.h2>

                <motion.p
                    variants={itemVariants}
                    className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 max-w-md mx-auto md:mx-0"
                >
                    Our friendly AI assistant guides your language journey, providing personalized help and adapting to your unique learning style.
                </motion.p>

                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start w-full sm:w-auto"
                >
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => goToStep(currentStep + 1)}
                        className="group px-6 py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 
                                  text-white font-medium rounded-full shadow-lg inline-flex items-center justify-center 
                                  space-x-2 transition-all duration-200 ease-in-out w-full sm:w-auto"
                    >
                        <span>Continue</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-transform duration-200 group-hover:translate-x-1"
                        >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </motion.button>

                    <div className="text-xs text-center sm:text-left text-zinc-500 dark:text-zinc-400 mt-2 sm:mt-0 sm:self-end mb-1">
                        Step {currentStep} of {totalSteps}
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default AIAssistanceStep;