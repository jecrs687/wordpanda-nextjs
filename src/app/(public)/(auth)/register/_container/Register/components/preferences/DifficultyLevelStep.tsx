import { motion } from 'framer-motion';
import { PreferenceOption } from '../PreferenceOption';

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

interface DifficultyLevelStepProps {
    selectedLevel: DifficultyLevel | null;
    onSelectLevel: (level: DifficultyLevel) => void;
    error?: string;
}

const difficultyOptions = [
    { id: '1', label: 'Beginner', icon: '🌱', description: 'Start with the basics' },
    { id: '2', label: 'Intermediate', icon: '🌿', description: 'Some knowledge but need practice' },
    { id: '3', label: 'Advanced', icon: '🌳', description: 'Solid foundation looking to improve' },
    { id: '4', label: 'Expert', icon: '🌲', description: 'Looking for challenging content' },
];

export const DifficultyLevelStep = ({ selectedLevel, onSelectLevel, error }: DifficultyLevelStepProps) => {
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
                Difficulty Level
            </h2>
            <p className="mb-6 text-zinc-600 dark:text-zinc-300">
                How challenging should your learning experience be?
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
