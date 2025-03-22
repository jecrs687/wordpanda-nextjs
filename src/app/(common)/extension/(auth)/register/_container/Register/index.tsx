'use client';
import { TOKEN_KEY } from '@constants/CONFIGS';
import { ROUTES } from '@constants/ROUTES';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { submit } from './action';
import { LearningPreferencesForm } from './components/LearningPreferencesForm';
import { ParticleBackground } from './components/ParticleBackground';
import { RegisterFooter } from './components/RegisterFooter';
import { RegisterHeader } from './components/RegisterHeader';
import { RegisterSteps } from './components/RegisterSteps';
import { UserAccountForm } from './components/UserAccountForm';

export default function Register() {
    const [state, formAction] = useActionState(submit, {})
    const router = useRouter()
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(new FormData());
    const totalSteps = 2;

    // Form submission wrapper to collect data across steps
    const handleStepSubmit = (data: FormData, isLastStep: boolean = false) => {
        const newFormData = new FormData();

        // Copy existing data
        for (const [key, value] of formData.entries()) {
            newFormData.append(key, value);
        }

        // Add new data
        for (const [key, value] of data.entries()) {
            newFormData.append(key, value);
        }

        setFormData(newFormData);

        if (isLastStep) {
            formAction(newFormData);
        } else {
            setStep(prev => prev + 1);
        }
    };

    const goToPreviousStep = () => {
        setStep(prev => Math.max(1, prev - 1));
    };

    useEffect(() => {
        if (state.token && typeof window !== 'undefined') {
            localStorage.setItem(TOKEN_KEY, state.token)
            router.push(ROUTES.DASHBOARD())
        }
    }, [state, router])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center w-full py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-zinc-50 to-sky-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-indigo-950/30 transition-colors duration-300 relative overflow-hidden">
            {/* Interactive background with particles */}
            <ParticleBackground />

            <motion.div
                className="max-w-lg w-full space-y-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/20 dark:border-gray-800/50 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Decorative elements */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-emerald-300/40 to-blue-400/40 dark:from-emerald-600/30 dark:to-blue-700/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-32 -left-20 w-64 h-64 bg-gradient-to-tr from-indigo-300/40 to-pink-400/30 dark:from-indigo-700/30 dark:to-purple-900/30 rounded-full blur-3xl"></div>

                <RegisterHeader currentStep={step} />

                <RegisterSteps currentStep={step} totalSteps={totalSteps} />

                <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700/50">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <UserAccountForm
                                key="step1"
                                onSubmit={handleStepSubmit}
                                errors={state.errors}
                            />
                        )}

                        {step === 2 && (
                            <LearningPreferencesForm
                                key="step2"
                                onSubmit={handleStepSubmit}
                                onBack={goToPreviousStep}
                                errors={state.errors}
                            />
                        )}
                    </AnimatePresence>
                </div>

                <RegisterFooter />
            </motion.div>
        </div>
    )
}
