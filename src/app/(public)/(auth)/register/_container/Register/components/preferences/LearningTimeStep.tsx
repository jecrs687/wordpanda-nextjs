import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PreferenceOption } from '../PreferenceOption';

type LearningTime = 'morning' | 'afternoon' | 'evening' | 'night';

interface LearningTimeStepProps {
    selectedTime: LearningTime | null;
    onSelectTime: (time: LearningTime) => void;
    error?: string;
}

export const LearningTimeStep = ({ selectedTime, onSelectTime, error }: LearningTimeStepProps) => {
    const { t } = useTranslation();

    const learningTimeOptions = [
        { id: 'morning', label: t('register.preferences.learningTime.options.morning.label'), icon: '🌅', description: t('register.preferences.learningTime.options.morning.description') },
        { id: 'afternoon', label: t('register.preferences.learningTime.options.afternoon.label'), icon: '☀️', description: t('register.preferences.learningTime.options.afternoon.description') },
        { id: 'evening', label: t('register.preferences.learningTime.options.evening.label'), icon: '🌆', description: t('register.preferences.learningTime.options.evening.description') },
        { id: 'night', label: t('register.preferences.learningTime.options.night.label'), icon: '🌙', description: t('register.preferences.learningTime.options.night.description') },
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
                {t('register.preferences.learningTime.title')}
            </h2>
            <p className="mb-6 text-zinc-600 dark:text-zinc-300">
                {t('register.preferences.learningTime.description')}
            </p>

            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"
                variants={containerVariants}
            >
                {learningTimeOptions.map((option) => (
                    <motion.div key={option.id} variants={itemVariants}>
                        <PreferenceOption
                            icon={option.icon}
                            label={option.label}
                            description={option.description}
                            selected={selectedTime === option.id}
                            onClick={() => onSelectTime(option.id as LearningTime)}
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
