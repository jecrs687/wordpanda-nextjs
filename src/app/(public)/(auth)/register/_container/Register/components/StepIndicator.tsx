import { useMediaQuery } from '@hooks/useMediaQuery';
import { motion } from 'framer-motion';

type StepIndicatorProps = {
    currentStep: number;
    totalSteps: number;
};

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
    const isMobile = useMediaQuery('(max-width: 640px)');

    const stepLabels = [
        "Account",
        "Personal",
        "Profile",
        "Preferences"
    ];

    return (
        <div className="mb-8">
            {/* Simple progress bar */}
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-emerald-600 dark:bg-emerald-500"
                    initial={{ width: `${((currentStep - 1) / totalSteps) * 100}%` }}
                    animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    transition={{ duration: 0.4 }}
                />
            </div>

            {/* Clean step indicators */}
            <div className="flex justify-between mt-4 px-2">
                {stepLabels.map((label, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === currentStep;
                    const isCompleted = stepNumber < currentStep;

                    return (
                        <div key={index} className="flex flex-col items-center">
                            <div
                                className={`
                                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium 
                                    ${isCompleted
                                        ? 'bg-emerald-500 text-white'
                                        : isActive
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                    }
                                    ${!isMobile ? 'shadow-sm' : ''}
                                `}
                            >
                                {isCompleted ? (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    stepNumber
                                )}
                            </div>

                            {!isMobile && (
                                <span
                                    className={`
                                        mt-2 text-xs font-medium 
                                        ${isActive
                                            ? 'text-emerald-600 dark:text-emerald-500'
                                            : isCompleted
                                                ? 'text-gray-700 dark:text-gray-300'
                                                : 'text-gray-400 dark:text-gray-500'
                                        }
                                    `}
                                >
                                    {label}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Accessibility */}
            <div className="sr-only" aria-live="polite">
                Step {currentStep} of {totalSteps}: {stepLabels[currentStep - 1]}
            </div>
        </div>
    );
}
