import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { FormButton } from './FormButton';
import { PreferenceOption } from './PreferenceOption';

type LearningPreferencesFormProps = {
    onSubmit: (data: FormData, goToNextStep?: boolean) => void;
    onBack: () => void;
    errors?: Record<string, string>;
    initialValues?: FormData;
    formAction: (formData: FormData) => void;
};

// Form submit button with loading state
function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <FormButton
            type="submit"
            fullWidth
            isLoading={pending}
            disabled={pending}
            icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            }
        >
            Complete Registration
        </FormButton>
    );
}

export function LearningPreferencesForm({
    onBack,
    errors = {},
    initialValues,
    formAction
}: LearningPreferencesFormProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const [dailyGoal, setDailyGoal] = useState(initialValues?.get('dailyGoal') as string || '30');
    const [learningTime, setLearningTime] = useState(initialValues?.get('preferredLearningTime') as string || 'Evening');
    const [learningStyle, setLearningStyle] = useState(initialValues?.get('learningStyle') as string || 'Visual');
    const [difficulty, setDifficulty] = useState(initialValues?.get('difficultyPreference') as string || '2');

    // Icons for learning styles
    const styleIcons = {
        Visual: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>,
        Auditory: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m0 0l-2.828 2.828m0 0a9 9 0 010-12.728m2.828 2.828a5 5 0 00-1.414 1.414m0 0L3 16.172" />
        </svg>,
        'Reading/Writing': <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>,
        Kinesthetic: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    };

    // Icons for time preferences
    const timeIcons = {
        Morning: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>,
        Afternoon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>,
        Evening: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>,
        Night: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
    };

    // Animation variants for card sections
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    return (
        <form
            ref={formRef}
            action={formAction}
            className="space-y-8 max-w-2xl mx-auto"
        >
            {/* Form progress indicator */}
            <div className="mb-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-xs text-right mt-1 text-gray-500 dark:text-gray-400">Step 3 of 4</p>
            </div>

            {/* Daily Goal Preference */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300"
            >
                <div className="mb-5">
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Daily Learning Goal
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
                        How much time would you like to spend learning each day?
                    </p>

                    <input
                        type="hidden"
                        name="dailyGoal"
                        value={dailyGoal}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                            { value: '15', label: '15 min', desc: 'Quick' },
                            { value: '30', label: '30 min', desc: 'Standard' },
                            { value: '45', label: '45 min', desc: 'Intensive' }
                        ].map((option) => (
                            <PreferenceOption
                                key={option.value}
                                selected={dailyGoal === option.value}
                                onClick={() => setDailyGoal(option.value)}
                                description={option.desc}
                                aria-label={`Set daily goal to ${option.label}`}
                            >
                                {option.label}
                            </PreferenceOption>
                        ))}
                    </div>

                    {errors.dailyGoal && (
                        <p className="mt-2 text-sm text-red-500 font-medium">
                            {errors.dailyGoal}
                        </p>
                    )}
                </div>
            </motion.div>

            {/* Preferred Learning Time */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                custom={1}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300"
            >
                <div className="mb-5">
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Preferred Learning Time
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
                        When are you most productive for learning new languages?
                    </p>

                    <input
                        type="hidden"
                        name="preferredLearningTime"
                        value={learningTime}
                    />

                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3">
                        {['Morning', 'Afternoon', 'Evening', 'Night'].map((time) => (
                            <PreferenceOption
                                key={time}
                                selected={learningTime === time}
                                onClick={() => setLearningTime(time)}
                                icon={timeIcons[time]}
                                aria-label={`Set preferred time to ${time}`}
                            >
                                {time}
                            </PreferenceOption>
                        ))}
                    </div>

                    {errors.preferredLearningTime && (
                        <p className="mt-2 text-sm text-red-500 font-medium">
                            {errors.preferredLearningTime}
                        </p>
                    )}
                </div>
            </motion.div>

            {/* Learning Style */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                custom={2}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300"
            >
                <div className="mb-5">
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Learning Style
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
                        How do you prefer to learn new information?
                    </p>

                    <input
                        type="hidden"
                        name="learningStyle"
                        value={learningStyle}
                    />

                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                        {[
                            { value: 'Visual', desc: 'Images & visuals' },
                            { value: 'Auditory', desc: 'Listening & speaking' },
                            { value: 'Reading/Writing', desc: 'Text & writing' },
                            { value: 'Kinesthetic', desc: 'Practice & interaction' }
                        ].map((style) => (
                            <PreferenceOption
                                key={style.value}
                                selected={learningStyle === style.value}
                                onClick={() => setLearningStyle(style.value)}
                                description={style.desc}
                                icon={styleIcons[style.value]}
                                aria-label={`Set learning style to ${style.value}`}
                            >
                                {style.value}
                            </PreferenceOption>
                        ))}
                    </div>

                    {errors.learningStyle && (
                        <p className="mt-2 text-sm text-red-500 font-medium">
                            {errors.learningStyle}
                        </p>
                    )}
                </div>
            </motion.div>

            {/* Difficulty Preference - improved slider */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                custom={3}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300"
            >
                <div className="mb-5">
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Difficulty Preference
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
                        How challenging would you like your learning experience to be?
                    </p>

                    <input
                        type="hidden"
                        name="difficultyPreference"
                        value={difficulty}
                    />

                    <div className="mb-6 px-1">
                        {/* Enhanced, accessible slider */}
                        <div className="relative w-full h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center">
                            <div
                                className="absolute h-full bg-gradient-to-r from-emerald-400 to-emerald-600 dark:from-emerald-600 dark:to-emerald-400 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${parseInt(difficulty) * 20}%` }}
                            />
                            <div className="absolute inset-0 flex justify-between px-4 sm:px-8">
                                {[1, 2, 3, 4, 5].map((value) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => setDifficulty(value.toString())}
                                        aria-label={`Set difficulty level ${value}`}
                                        aria-pressed={parseInt(difficulty) === value}
                                        className={`relative w-8 h-8 rounded-full flex items-center justify-center z-10
                                            transition-all duration-200
                                            ${parseInt(difficulty) >= value
                                                ? 'text-white'
                                                : 'text-gray-600 dark:text-gray-300'}
                                            ${parseInt(difficulty) === value
                                                ? 'font-bold transform scale-110 shadow-md'
                                                : 'hover:scale-105'}
                                            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
                                        `}
                                    >
                                        {value}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between mt-3 text-sm text-gray-600 dark:text-gray-400 px-4">
                            <span className="font-medium">Beginner-Friendly</span>
                            <span className="font-medium">Advanced</span>
                        </div>
                    </div>

                    {errors.difficultyPreference && (
                        <p className="mt-1 text-sm text-red-500 font-medium">
                            {errors.difficultyPreference}
                        </p>
                    )}
                </div>
            </motion.div>

            {/* Form actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <FormButton
                    variant="outline"
                    onClick={onBack}
                    icon={
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    }
                >
                    Back
                </FormButton>

                <div className="order-1 sm:order-2 w-full sm:w-auto sm:ml-auto">
                    <SubmitButton />
                </div>
            </div>
        </form>
    );
}
