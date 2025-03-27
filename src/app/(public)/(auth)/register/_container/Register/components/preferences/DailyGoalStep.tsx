import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { GoalOption } from './GoalOption';

interface DailyGoalStepProps {
    selectedGoal: number | null;
    onSelectGoal: (goal: number) => void;
    error?: string;
}

export const DailyGoalStep = ({ selectedGoal, onSelectGoal, error }: DailyGoalStepProps) => {
    const { t } = useTranslation();

    const dailyGoalOptions = [
        { value: 5, label: t('register.preferences.dailyGoal.options.5.label'), description: t('register.preferences.dailyGoal.options.5.description') },
        { value: 10, label: t('register.preferences.dailyGoal.options.10.label'), description: t('register.preferences.dailyGoal.options.10.description') },
        { value: 15, label: t('register.preferences.dailyGoal.options.15.label'), description: t('register.preferences.dailyGoal.options.15.description') },
        { value: 30, label: t('register.preferences.dailyGoal.options.30.label'), description: t('register.preferences.dailyGoal.options.30.description') },
        { value: 60, label: t('register.preferences.dailyGoal.options.60.label'), description: t('register.preferences.dailyGoal.options.60.description') },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1"
        >
            <h2 className="text-2xl font-bold mb-2 text-zinc-800 dark:text-white">
                {t('register.preferences.dailyGoal.title')}
            </h2>
            <p className="mb-6 text-zinc-600 dark:text-zinc-300">
                {t('register.preferences.dailyGoal.description')}
            </p>

            <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4"
                variants={containerVariants}
            >
                {dailyGoalOptions.map((option) => (
                    <motion.div key={option.value} variants={itemVariants}>
                        <GoalOption
                            value={option.value}
                            label={option.label}
                            description={option.description}
                            selected={selectedGoal === option.value}
                            onClick={() => onSelectGoal(option.value)}
                        />
                    </motion.div>
                ))}
            </motion.div>

            {error && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 text-rose-500 text-sm font-medium"
                >
                    {error}
                </motion.p>
            )}
        </motion.div>
    );
};
