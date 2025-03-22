import { motion } from 'framer-motion';
import { PreferenceOption } from '../PreferenceOption';

type LearningTime = 'morning' | 'afternoon' | 'evening' | 'night';

interface LearningTimeStepProps {
    selectedTime: LearningTime | null;
    onSelectTime: (time: LearningTime) => void;
    error?: string;
}

const learningTimeOptions = [
    { id: 'morning', label: 'Morning', icon: '🌅', description: '5am - 11am' },
    { id: 'afternoon', label: 'Afternoon', icon: '☀️', description: '12pm - 5pm' },
    { id: 'evening', label: 'Evening', icon: '🌆', description: '6pm - 9pm' },
    { id: 'night', label: 'Night', icon: '🌙', description: '10pm - 4am' },
];

export const LearningTimeStep = ({ selectedTime, onSelectTime, error }: LearningTimeStepProps) => {
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
                Preferred Learning Time
            </h2>
            <p className="mb-6 text-zinc-600 dark:text-zinc-300">
                When do you want to receive notifications and study reminders?
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
