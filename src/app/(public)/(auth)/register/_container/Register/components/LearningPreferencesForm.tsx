"use client";
import LoaderSpinner from '@core/LoaderSpinner';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormButton } from './FormButton';
import { DailyGoalStep } from './preferences/DailyGoalStep';
import { DifficultyLevelStep } from './preferences/DifficultyLevelStep';
import { LearningStyleStep } from './preferences/LearningStyleStep';
import { LearningTimeStep } from './preferences/LearningTimeStep';
import { StepProgressBar } from './preferences/StepProgressBar';

// Define types for learning preferences
type LearningStyle = 'visual' | 'auditory' | 'reading' | 'kinesthetic';
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
type LearningTime = 'morning' | 'afternoon' | 'evening' | 'night';

interface LearningPreferencesFormProps {
    onSubmit: (data: FormData, goToNextStep?: boolean) => void;
    onBack: () => void;
    errors?: Record<string, string>;
    initialValues: FormData;
    formAction: (formData: FormData) => void;
    isSubmitting?: boolean;
}

export const LearningPreferencesForm = ({
    onSubmit,
    onBack,
    errors,
    initialValues,
    formAction,
    isSubmitting = false,
}: LearningPreferencesFormProps) => {
    const { t } = useTranslation();
    // Current step state
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;

    // Form state
    const [learningStyle, setLearningStyle] = useState<LearningStyle | null>(null);
    const [difficultyPreference, setDifficultyPreference] = useState<DifficultyLevel | null>(null);
    const [preferredLearningTime, setPreferredLearningTime] = useState<LearningTime | null>(null);
    const [dailyGoal, setDailyGoal] = useState<number | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    // Initialize form with existing values if any
    useEffect(() => {
        if (initialValues) {
            const style = initialValues.get('learningStyle') as LearningStyle;
            const difficulty = initialValues.get('difficultyPreference') as DifficultyLevel;
            const time = initialValues.get('preferredLearningTime') as LearningTime;
            const goal = initialValues.get('dailyGoal');

            if (style) setLearningStyle(style);
            if (difficulty) setDifficultyPreference(difficulty);
            if (time) setPreferredLearningTime(time);
            if (goal) setDailyGoal(Number(goal));
        }
    }, [initialValues]);

    // Update validation errors from server
    useEffect(() => {
        if (errors) {
            setValidationErrors(errors);
        }
    }, [errors]);

    // Go to next step if current step is valid
    const goToNextStep = () => {
        let isValid = true;

        // Validate current step
        if (currentStep === 1 && !learningStyle) {
            setValidationErrors(prev => ({ ...prev, learningStyle: t('register.preferences.errors.learningStyle') }));
            isValid = false;
        }

        if (currentStep === 2 && !difficultyPreference) {
            setValidationErrors(prev => ({ ...prev, difficultyPreference: t('register.preferences.errors.difficultyPreference') }));
            isValid = false;
        }

        if (currentStep === 3 && !preferredLearningTime) {
            setValidationErrors(prev => ({ ...prev, preferredLearningTime: t('register.preferences.errors.preferredLearningTime') }));
            isValid = false;
        }

        if (currentStep === 4 && !dailyGoal) {
            setValidationErrors(prev => ({ ...prev, dailyGoal: t('register.preferences.errors.dailyGoal') }));
            isValid = false;
        }

        if (isValid) {
            if (currentStep < totalSteps) {
                setCurrentStep(prev => prev + 1);
                // Clear validation errors for next step
                setValidationErrors({});
            } else {
                handleSubmit();
            }
        }
    };

    // Go to previous step
    const goToPrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            // Clear validation errors when going back
            setValidationErrors({});
        } else {
            onBack(); // Go to previous form section
        }
    };

    // Submit form data
    const handleSubmit = () => {
        // Validate all fields
        const newErrors: Record<string, string> = {};

        if (!learningStyle) {
            newErrors.learningStyle = t('register.preferences.errors.learningStyle');
        }

        if (!difficultyPreference) {
            newErrors.difficultyPreference = t('register.preferences.errors.difficultyPreference');
        }

        if (!preferredLearningTime) {
            newErrors.preferredLearningTime = t('register.preferences.errors.preferredLearningTime');
        }

        if (!dailyGoal) {
            newErrors.dailyGoal = t('register.preferences.errors.dailyGoal');
        }

        setValidationErrors(newErrors);

        // If there are validation errors, don't submit
        if (Object.keys(newErrors).length > 0) {
            // Go to the first step with an error
            if (newErrors.learningStyle) setCurrentStep(1);
            else if (newErrors.difficultyPreference) setCurrentStep(2);
            else if (newErrors.preferredLearningTime) setCurrentStep(3);
            else if (newErrors.dailyGoal) setCurrentStep(4);
            return;
        }

        // Create form data
        const formData = new FormData();
        formData.append('learningStyle', learningStyle as string);
        formData.append('difficultyPreference', difficultyPreference as string);
        formData.append('preferredLearningTime', preferredLearningTime as string);
        formData.append('dailyGoal', dailyGoal?.toString() as string);

        // Submit form data
        onSubmit(formData);
    };

    // Animation variants
    const pageVariants = {
        enter: { x: '100%', opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: '-100%', opacity: 0 }
    };

    const pageTransition = {
        type: 'tween',
        ease: 'easeInOut',
        duration: 0.3
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-3xl mx-auto px-4 md:px-0"
        >
            <div className="mb-8">
                <StepProgressBar
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    steps={[
                        { label: "learningStyle" },
                        { label: "difficultyLevel" },
                        { label: "learningTime" },
                        { label: "dailyGoal" }
                    ]}
                />
            </div>

            <div className="relative overflow-hidden bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-4 md:p-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        variants={pageVariants}
                        transition={pageTransition}
                        className="min-h-[300px] flex flex-col"
                    >
                        {currentStep === 1 && (
                            <LearningStyleStep
                                selectedStyle={learningStyle}
                                onSelectStyle={setLearningStyle}
                                error={validationErrors.learningStyle}
                            />
                        )}

                        {currentStep === 2 && (
                            <DifficultyLevelStep
                                selectedLevel={difficultyPreference}
                                onSelectLevel={setDifficultyPreference}
                                error={validationErrors.difficultyPreference}
                            />
                        )}

                        {currentStep === 3 && (
                            <LearningTimeStep
                                selectedTime={preferredLearningTime}
                                onSelectTime={setPreferredLearningTime}
                                error={validationErrors.preferredLearningTime}
                            />
                        )}

                        {currentStep === 4 && (
                            <DailyGoalStep
                                selectedGoal={dailyGoal}
                                onSelectGoal={setDailyGoal}
                                error={validationErrors.dailyGoal}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-4 mt-6 justify-between">
                <FormButton
                    type="button"
                    onClick={goToPrevStep}
                    variant="secondary"
                    className="w-full sm:w-auto"
                >
                    {currentStep === 1 ? t('register.form.buttons.back') : t('register.form.buttons.previous')}
                </FormButton>

                <FormButton
                    type="button"
                    onClick={goToNextStep}
                    variant="primary"
                    className="w-full sm:w-auto"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center">
                            <LoaderSpinner size="small" />
                            <span className="ml-2">{t('register.form.buttons.completingRegistration')}</span>
                        </div>
                    ) : currentStep < totalSteps ? (
                        t('register.form.buttons.next')
                    ) : (
                        t('register.form.buttons.completeRegistration')
                    )}
                </FormButton>
            </div>
        </motion.div>
    );
};
