import { motion } from 'framer-motion';
import { PreferenceOption } from '../PreferenceOption';

type LearningStyle = 'visual' | 'auditory' | 'reading' | 'kinesthetic';

interface LearningStyleStepProps {
    selectedStyle: LearningStyle | null;
    onSelectStyle: (style: LearningStyle) => void;
    error?: string;
}

const learningStyleOptions = [
    { id: 'visual', label: 'Visual', icon: '👁️', description: 'Learn through images, videos, and visual aids' },
    { id: 'auditory', label: 'Auditory', icon: '👂', description: 'Learn by listening to explanations and audio' },
    { id: 'reading', label: 'Reading', icon: '📚', description: 'Learn by reading texts and written materials' },
    { id: 'kinesthetic', label: 'Kinesthetic', icon: '✋', description: 'Learn through interactive exercises and practice' },
];

export const LearningStyleStep = ({ selectedStyle, onSelectStyle, error }: LearningStyleStepProps) => {
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
                Learning Style
            </h2>
            <p className="mb-6 text-zinc-600 dark:text-zinc-300">
                How do you prefer to learn new information?
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
