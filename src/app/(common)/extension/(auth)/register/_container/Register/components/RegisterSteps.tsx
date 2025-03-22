'use client';
import { motion } from 'framer-motion';

interface RegisterStepsProps {
    currentStep: number;
    totalSteps: number;
}

export function RegisterSteps({ currentStep, totalSteps }: RegisterStepsProps) {
    const stepLabels = ["Account", "Preferences"];

    return (
        <div className="my-6 relative z-10">
            <div className="flex justify-center items-center">
                <div className="relative w-full max-w-xs">
                    {/* Progress bar */}
                    <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
                            initial={{ width: "0%" }}
                            animate={{ width: `${(currentStep - 1) / (totalSteps - 1) * 100}%` }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                    </div>

                    {/* Step indicators */}
                    <div className="absolute -top-2 w-full flex justify-between">
                        {Array.from({ length: totalSteps }).map((_, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <motion.div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs border-2
                    ${index + 1 <= currentStep
                                            ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white border-white dark:border-gray-800'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-white dark:border-gray-800'
                                        }`}
                                    initial={{ scale: 0.8 }}
                                    animate={{
                                        scale: index + 1 === currentStep ? 1.2 : 1,
                                        backgroundColor: index + 1 <= currentStep ? 'var(--active-color)' : 'var(--inactive-color)'
                                    }}
                                    transition={{ duration: 0.3, type: "spring" }}
                                    style={{
                                        '--active-color': index + 1 === currentStep ? '#10b981' : '#059669',
                                        '--inactive-color': '#e5e7eb',
                                    } as any}
                                >
                                    {index + 1 <= currentStep ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        index + 1
                                    )}
                                </motion.div>
                                <motion.span
                                    className={`mt-2 text-xs font-medium ${index + 1 === currentStep
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : index + 1 < currentStep
                                            ? 'text-gray-600 dark:text-gray-400'
                                            : 'text-gray-400 dark:text-gray-500'
                                        }`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {stepLabels[index]}
                                </motion.span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
