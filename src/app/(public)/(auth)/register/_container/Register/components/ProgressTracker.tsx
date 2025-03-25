import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface ProgressTrackerProps {
    currentStep: number;
    totalSteps: number;
    percentage: number;
}

export const ProgressTracker = ({ currentStep, totalSteps, percentage }: ProgressTrackerProps) => {
    const { t } = useTranslation();

    // Generate step markers based on total steps
    const stepMarkers = Array.from({ length: totalSteps }, (_, i) => i + 1);

    return (
        <div className="w-full">
            {/* Step numbers */}
            <div className="flex justify-between mb-2">
                {stepMarkers.map((step) => (
                    <div
                        key={`step-marker-${step}`}
                        className="flex flex-col items-center"
                    >
                        <div
                            className={`
                h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium
                transition-all duration-300 ease-in-out
                ${step <= currentStep
                                    ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-md shadow-emerald-200/50 dark:shadow-emerald-900/30'
                                    : 'bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'}
              `}
                        >
                            {step}
                        </div>
                    </div>
                ))}
            </div>

            {/* Progress bar */}
            <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden dark:bg-zinc-800">
                <motion.div
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </div>

            {/* Step labels (visible on larger screens) */}
            <div className="hidden sm:flex justify-between mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                <div className="text-center">{t('register.steps.labels.account')}</div>
                <div className="text-center">{t('register.steps.labels.personal')}</div>
                <div className="text-center">{t('register.steps.labels.profile')}</div>
                <div className="text-center">{t('register.steps.labels.preferences')}</div>
            </div>
        </div>
    );
};
