import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface StepProgressBarProps {
    currentStep: number;
    totalSteps: number;
    steps: { label: string }[];
}

export const StepProgressBar = ({ currentStep, totalSteps, steps }: StepProgressBarProps) => {
    const { t } = useTranslation();

    // Calculate progress percentage
    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isCurrent = stepNumber === currentStep;

                    return (
                        <div key={index} className="flex flex-col items-center relative">
                            <motion.div
                                className={`rounded-full flex items-center justify-center z-10 border-2 w-8 h-8 md:w-10 md:h-10 font-semibold text-sm
                                    ${isCompleted
                                        ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                                        : isCurrent
                                            ? 'bg-green-500 text-white border-green-500'
                                            : 'bg-white text-zinc-400 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700'
                                    }`}
                                animate={{
                                    scale: isCurrent ? [1, 1.1, 1] : 1
                                }}
                                transition={{
                                    duration: 0.5,
                                    ease: "easeInOut",
                                    times: [0, 0.5, 1],
                                    repeat: isCurrent ? Infinity : 0,
                                    repeatDelay: 3
                                }}
                            >
                                {stepNumber}
                            </motion.div>
                            <span className={`mt-2 text-xs font-medium hidden md:block ${isCurrent ? 'text-green-600 dark:text-green-400' : 'text-zinc-500 dark:text-zinc-400'}`}>
                                {t(`register.preferences.steps.${step.label}`)}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Progress bar */}
            <div className="relative h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mt-2 md:mt-0">
                <motion.div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-black to-green-500 dark:from-white dark:to-green-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            {/* Mobile step indicator */}
            <div className="md:hidden text-center mt-4">
                <p className="font-semibold text-green-600 dark:text-green-400">
                    {t(`register.preferences.steps.${steps[currentStep - 1].label}`)}
                </p>
            </div>
        </div>
    );
};
