"use client";
import { TOKEN_KEY } from '@constants/CONFIGS';
import { ROUTES } from '@constants/ROUTES';
import { setCookie } from '@utils/cookie';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { submit } from './action';
import { AccountDetailsForm } from './components/AccountDetailsForm';
import { ErrorDialog } from './components/ErrorDialog';
import { LearningPreferencesForm } from './components/LearningPreferencesForm';
import { PersonalDetailsForm } from './components/PersonalDetailsForm';
import { ProfileSetupForm } from './components/ProfileSetupForm';
import { RegistrationComplete } from './components/RegistrationComplete';
import { RegistrationHeader } from './components/RegistrationHeader';
import { RegistrationLayout } from './components/RegistrationLayout';
import { StepIndicator } from './components/StepIndicator';

export default function Register() {
    const [state, formAction] = useActionState(submit, {});
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(new FormData());
    const [showError, setShowError] = useState(false);
    const totalSteps = 4;

    // Handle form submission for each step
    const handleStepSubmit = (data: FormData, goToNextStep: boolean = true) => {
        const newFormData = new FormData();

        // Preserve existing data
        for (const [key, value] of formData.entries()) {
            newFormData.append(key, value);
        }

        // Add new data from the current step
        for (const [key, value] of data.entries()) {
            newFormData.append(key, value);
        }

        setFormData(newFormData);

        if (goToNextStep && step < totalSteps) {
            setStep(prev => prev + 1);
        } else if (step === totalSteps) {
            formAction(newFormData);
        }
    };

    // Navigation between steps
    const goToPreviousStep = () => {
        if (step > 1) {
            setStep(prev => prev - 1);
        }
    };

    // Handle submission responses
    useEffect(() => {
        if (state.success) {
            router.push(ROUTES.OTP(state.user.id));
        }

        if (state.error) {
            setShowError(true);
        }

        if (state.token) {
            localStorage.setItem(TOKEN_KEY, state.token);
            setCookie(TOKEN_KEY, state.token);
            router.push(ROUTES.DASHBOARD());
        }

        // Handle validation errors - return to the appropriate step
        if (state.errors) {
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
                message={state.error || "An error occurred during registration"}
            />

            <RegistrationHeader step={step} totalSteps={totalSteps} />

            <StepIndicator currentStep={step} totalSteps={totalSteps} />

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <AccountDetailsForm
                        onSubmit={handleStepSubmit}
                        errors={state.errors}
                        initialValues={formData}
                    />
                )}

                {step === 2 && (
                    <PersonalDetailsForm
                        onSubmit={handleStepSubmit}
                        onBack={goToPreviousStep}
                        errors={state.errors}
                        initialValues={formData}
                    />
                )}

                {step === 3 && (
                    <ProfileSetupForm
                        onSubmit={handleStepSubmit}
                        onBack={goToPreviousStep}
                        errors={state.errors}
                        initialValues={formData}
                    />
                )}

                {step === 4 && (
                    <LearningPreferencesForm
                        onSubmit={handleStepSubmit}
                        onBack={goToPreviousStep}
                        errors={state.errors}
                        initialValues={formData}
                        formAction={formAction}
                    />
                )}

                {step === 5 && (
                    <RegistrationComplete />
                )}
            </AnimatePresence>
        </RegistrationLayout>
    );
}

