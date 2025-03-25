import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PreferenceOption } from '../PreferenceOption';

type LearningStyle = 'visual' | 'auditory' | 'reading' | 'kinesthetic';

interface LearningStyleStepProps {
    selectedStyle: LearningStyle | null;
    onSelectStyle: (style: LearningStyle) => void;
    error?: string;
}

export const LearningStyleStep = ({ selectedStyle, onSelectStyle, error }: LearningStyleStepProps) => {
    const { t } = useTranslation();

    const learningStyleOptions = [
        { id: 'visual', label: t('register.preferences.learningStyle.options.visual.label'), icon: '👁️', description: t('register.preferences.learningStyle.options.visual.description') },
        { id: 'auditory', label: t('register.preferences.learningStyle.options.auditory.label'), icon: '👂', description: t('register.preferences.learningStyle.options.auditory.description') },
        { id: 'reading', label: t('register.preferences.learningStyle.options.reading.label'), icon: '📚', description: t('register.preferences.learningStyle.options.reading.description') },
        { id: 'kinesthetic', label: t('register.preferences.learningStyle.options.kinesthetic.label'), icon: '✋', description: t('register.preferences.learningStyle.options.kinesthetic.description') },
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
                {t('register.preferences.learningStyle.title')}
            </h2>
            <p className="mb-6 text-zinc-600 dark:text-zinc-300">
                {t('register.preferences.learningStyle.description')}
            </p>

            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"
                variants={containerVariants}
            >
                {learningStyleOptions.map((option) => (
                    <motion.div key={option.id} variants={itemVariants}>
                        <PreferenceOption
                            icon={option.icon}
                            label={option.label}
                            description={option.description}
                            selected={selectedStyle === option.id}
                            onClick={() => onSelectStyle(option.id as LearningStyle)}
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
