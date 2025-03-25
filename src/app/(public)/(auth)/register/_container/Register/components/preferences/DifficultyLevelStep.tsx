import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PreferenceOption } from '../PreferenceOption';

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

interface DifficultyLevelStepProps {
    selectedLevel: DifficultyLevel | null;
    onSelectLevel: (level: DifficultyLevel) => void;
    error?: string;
}

export const DifficultyLevelStep = ({ selectedLevel, onSelectLevel, error }: DifficultyLevelStepProps) => {
    const { t } = useTranslation();

    const difficultyOptions = [
        { id: 'beginner', label: t('register.preferences.difficulty.options.beginner.label'), icon: '🌱', description: t('register.preferences.difficulty.options.beginner.description') },
        { id: 'intermediate', label: t('register.preferences.difficulty.options.intermediate.label'), icon: '🌿', description: t('register.preferences.difficulty.options.intermediate.description') },
        { id: 'advanced', label: t('register.preferences.difficulty.options.advanced.label'), icon: '🌳', description: t('register.preferences.difficulty.options.advanced.description') },
        { id: 'expert', label: t('register.preferences.difficulty.options.expert.label'), icon: '🌲', description: t('register.preferences.difficulty.options.expert.description') },
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
                {t('register.preferences.difficulty.title')}
            </h2>
            <p className="mb-6 text-zinc-600 dark:text-zinc-300">
                {t('register.preferences.difficulty.description')}
            </p>

            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"
                variants={containerVariants}
            >
                {difficultyOptions.map((option) => (
                    <motion.div key={option.id} variants={itemVariants}>
                        <PreferenceOption
                            icon={option.icon}
                            label={option.label}
                            description={option.description}
                            selected={selectedLevel === option.id}
                            onClick={() => onSelectLevel(option.id as DifficultyLevel)}
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
