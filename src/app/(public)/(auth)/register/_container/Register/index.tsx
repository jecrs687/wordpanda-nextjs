"use client";
import { TOKEN_KEY } from '@constants/CONFIGS';
import { ROUTES } from '@constants/ROUTES';
import { setCookie } from '@utils/cookie';
import { translateValidationErrors } from '@utils/translateValidation';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { submit } from './action';
import { AccountDetailsForm } from './components/AccountDetailsForm';
import { ErrorDialog } from './components/ErrorDialog';
import { LearningPreferencesForm } from './components/LearningPreferencesForm';
import { PersonalDetailsForm } from './components/PersonalDetailsForm';
import { ProfileSetupForm } from './components/ProfileSetupForm';
import { ProgressTracker } from './components/ProgressTracker';
import { RegistrationComplete } from './components/RegistrationComplete';
import { RegistrationHeader } from './components/RegistrationHeader';
import { RegistrationLayout } from './components/RegistrationLayout';

// Animation variants for page transitions
const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
};

export default function Register() {
    const { t } = useTranslation();
    const [state, formAction] = useActionState(submit, {});
    const [translatedErrors, setTranslatedErrors] = useState<Record<string, string>>({});
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(new FormData());
    const [showError, setShowError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const totalSteps = 4;

    // Calculate progress percentage
    const progressPercentage = (step / totalSteps) * 100;

    // Handle form submission for each step
    const handleStepSubmit = (data: FormData, goToNextStep: boolean = true) => {
        const newFormData = new FormData();

        // Preserve existing data
        for (const [key, value] of formData.entries()) {
            newFormData.append(key, value);
        }

        // Add new data from the current step
        for (const [key, value] of data.entries()) {
            newFormData.set(key, value);
        }

        setFormData(newFormData);

        if (goToNextStep && step < totalSteps) {
            setStep(prev => prev + 1);
            // Scroll to top when changing steps
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (step === totalSteps) {
            setIsSubmitting(true);
            formAction(newFormData);
        }
    };

    // Navigation between steps
    const goToPreviousStep = () => {
        if (step > 1) {
            setStep(prev => prev - 1);
            // Scroll to top when changing steps
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Handle submission responses
    useEffect(() => {
        if (state.success) {
            router.push(ROUTES.OTP(state.user.id));
        }

        if (state.error) {
            setShowError(true);
            setIsSubmitting(false);
        }

        if (state.token) {
            localStorage.setItem(TOKEN_KEY, state.token);
            setCookie(TOKEN_KEY, state.token);
            router.push(ROUTES.DASHBOARD());
        }

        // Handle validation errors - return to the appropriate step
        if (state.errors) {
            setIsSubmitting(false);
            // Translate validation error messages
            setTranslatedErrors(translateValidationErrors(state.errors));

            const errorFields = Object.keys(state.errors);

            if (errorFields.some(field => ['email', 'password', 'passwordConfirmation'].includes(field))) {
                setStep(1);
            } else if (errorFields.some(field => ['firstName', 'lastName'].includes(field))) {
                setStep(2);
            } else if (errorFields.some(field => ['phone', 'username', 'languageId'].includes(field))) {
                setStep(3);
            } else if (errorFields.some(field => ['dailyGoal', 'preferredLearningTime', 'learningStyle', 'difficultyPreference'].includes(field))) {
                setStep(4);
            }
        }
    }, [state, router]);

    return (
        <RegistrationLayout>
            <ErrorDialog
                open={showError}
                onClose={() => setShowError(false)}
                message={state.error ? t(state.error) : t('register.errors.general')}
            />

            <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
                <div className="mb-6 md:mb-8">
                    <RegistrationHeader step={step} totalSteps={totalSteps} />
                </div>

                <div className="mb-6">
                    <ProgressTracker
                        currentStep={step}
                        totalSteps={totalSteps}
                        percentage={progressPercentage}
                    />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={`step-${step}`}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={pageVariants}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="w-full"
                    >
                        {step === 1 && (
                            <AccountDetailsForm
                                onSubmit={handleStepSubmit}
                                errors={translatedErrors}
                                initialValues={formData}
                            />
                        )}

                        {step === 2 && (
                            <PersonalDetailsForm
                                onSubmit={handleStepSubmit}
                                onBack={goToPreviousStep}
                                errors={translatedErrors}
                                initialValues={formData}
                            />
                        )}

                        {step === 3 && (
                            <ProfileSetupForm
                                onSubmit={handleStepSubmit}
                                onBack={goToPreviousStep}
                                errors={translatedErrors}
                                initialValues={formData}
                            />
                        )}

                        {step === 4 && (
                            <LearningPreferencesForm
                                onSubmit={handleStepSubmit}
                                onBack={goToPreviousStep}
                                errors={translatedErrors}
                                initialValues={formData}
                                formAction={formAction}
                                isSubmitting={isSubmitting}
                            />
                        )}

                        {step === 5 && (
                            <RegistrationComplete />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </RegistrationLayout>
    );
}

