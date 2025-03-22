'use client';
import { SelectLanguage } from '@common/SelectLanguage';
import { motion } from 'framer-motion';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';

interface LearningPreferencesFormProps {
    onSubmit: (formData: FormData, isLastStep?: boolean) => void;
    onBack: () => void;
    errors?: {
        firstName?: string;
        lastName?: string;
        phone?: string;
        dailyGoal?: string;
        preferredLearningTime?: string;
        learningStyle?: string;
        difficultyPreference?: string;
    };
}

export function LearningPreferencesForm({ onSubmit, onBack, errors }: LearningPreferencesFormProps) {
    const personalFields = [
        { name: 'firstName', title: 'First Name', type: 'text', placeholder: 'John', error: errors?.firstName, icon: 'user' },
        { name: 'lastName', title: 'Last Name', type: 'text', placeholder: 'Doe', error: errors?.lastName, icon: 'user' },
        { name: 'phone', title: 'Phone Number', type: 'tel', placeholder: '+1 (555) 000-0000', error: errors?.phone, optional: true, icon: 'phone' },
    ];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        onSubmit(formData, true);
    };

    const learningTimeOptions = [
        { value: 'Morning', label: 'Morning (6AM-12PM)' },
        { value: 'Afternoon', label: 'Afternoon (12PM-5PM)' },
        { value: 'Evening', label: 'Evening (5PM-9PM)' },
        { value: 'Night', label: 'Night (9PM-6AM)' },
    ];

    const learningStyleOptions = [
        { value: 'Visual', label: 'Visual (learn by seeing)' },
        { value: 'Auditory', label: 'Auditory (learn by hearing)' },
        { value: 'Reading', label: 'Reading/Writing (learn by reading/writing)' },
        { value: 'Kinesthetic', label: 'Kinesthetic (learn by doing)' },
    ];

    const difficultyOptions = [
        { value: '1', label: 'Beginner - Very Easy' },
        { value: '2', label: 'Easy' },
        { value: '3', label: 'Moderate' },
        { value: '4', label: 'Challenging' },
        { value: '5', label: 'Expert - Very Challenging' },
    ];

    // Animation variants for staggered animations
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.07
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="space-y-6"
                >
                    <motion.div variants={itemVariants}>
                        <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 mr-2 text-xs font-bold">1</span>
                            Personal Information
                        </h3>
                        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-100 dark:border-gray-700/50 shadow-sm">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {personalFields.map((field, index) => (
                                    <motion.div
                                        key={field.name}
                                        variants={itemVariants}
                                    >
                                        <FormInput
                                            name={field.name}
                                            title={field.title}
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            error={field.error}
                                            optional={field.optional}
                                            icon={field.icon}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-2 text-xs font-bold">2</span>
                            Learning Preferences
                        </h3>
                        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-100 dark:border-gray-700/50 shadow-sm">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <motion.div variants={itemVariants}>
                                    <FormInput
                                        name="dailyGoal"
                                        title="Daily Goal (words/minutes)"
                                        type="number"
                                        placeholder="30"
                                        error={errors?.dailyGoal}
                                        min={5}
                                        max={120}
                                        defaultValue="30"
                                        icon="target"
                                    />
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <FormSelect
                                        name="preferredLearningTime"
                                        title="Preferred Learning Time"
                                        options={learningTimeOptions}
                                        error={errors?.preferredLearningTime}
                                        icon="calendar"
                                    />
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <FormSelect
                                        name="learningStyle"
                                        title="Learning Style"
                                        options={learningStyleOptions}
                                        error={errors?.learningStyle}
                                        icon="brain"
                                    />
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <FormSelect
                                        name="difficultyPreference"
                                        title="Difficulty Preference"
                                        options={difficultyOptions}
                                        error={errors?.difficultyPreference}
                                        icon="chart"
                                    />
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 mr-2 text-xs font-bold">3</span>
                            Language Selection
                        </h3>
                        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-100 dark:border-gray-700/50 shadow-sm">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Preferred Language to Learn
                            </label>
                            <SelectLanguage className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200" />
                        </div>
                    </motion.div>
                </motion.div>

                <div className="flex space-x-3 pt-2">
                    <motion.button
                        type="button"
                        onClick={onBack}
                        className="flex items-center justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-sm transition-all duration-200"
                        whileHover={{ scale: 1.01, x: -3 }}
                        whileTap={{ scale: 0.98 }}
                        variants={itemVariants}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back
                    </motion.button>

                    <motion.button
                        type="submit"
                        className="flex-1 group relative flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-md transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        variants={itemVariants}
                    >
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            <svg className="h-5 w-5 text-emerald-200 group-hover:text-emerald-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                        </span>
                        Create Account
                    </motion.button>
                </div>
            </form>
        </motion.div>
    );
}
