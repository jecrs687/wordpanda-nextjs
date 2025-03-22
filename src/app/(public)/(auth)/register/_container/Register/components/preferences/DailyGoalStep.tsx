import { motion } from 'framer-motion';
import { GoalOption } from './GoalOption';

interface DailyGoalStepProps {
    selectedGoal: number | null;
    onSelectGoal: (goal: number) => void;
    error?: string;
}

const dailyGoalOptions = [
    { value: 5, label: '5 minutes', description: 'Quick daily practice' },
    { value: 10, label: '10 minutes', description: 'Short but effective' },
    { value: 15, label: '15 minutes', description: 'Balanced commitment' },
    { value: 30, label: '30 minutes', description: 'Dedicated learning' },
    { value: 60, label: '60 minutes', description: 'Immersive sessions' },
];

export const DailyGoalStep = ({ selectedGoal, onSelectGoal, error }: DailyGoalStepProps) => {
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
                Daily Goal
            </h2>
            <p className="mb-6 text-zinc-600 dark:text-zinc-300">
                How much time can you commit to learning each day?
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
