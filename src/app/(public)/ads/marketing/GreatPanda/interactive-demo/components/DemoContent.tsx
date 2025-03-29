'use client';

import { cn } from '@utils/utils';
import { useTheme } from 'next-themes';
import { Step1LanguageSelection } from './Step1LanguageSelection';
import { Step2GoalSetting } from './Step2GoalSetting';
import { Step3FeatureDemo } from './Step3FeatureDemo';
import { Step4ProgressTracking } from './Step4ProgressTracking';

type DemoContentProps = {
    step: number;
    setStep: (step: number) => void;
};

export const DemoContent = ({ step, setStep }: DemoContentProps) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const nextStep = () => {
        if (step < 4) {
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    return (
        <div className="h-full">
            {/* Step content */}
            <div className="min-h-[500px] mb-8">
                {step === 1 && <Step1LanguageSelection />}
                {step === 2 && <Step2GoalSetting />}
                {step === 3 && <Step3FeatureDemo />}
                {step === 4 && <Step4ProgressTracking />}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between">
                <button
                    onClick={prevStep}
                    className={cn(
                        "px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2",
                        step === 1 ? "opacity-50 cursor-not-allowed" : "opacity-100 cursor-pointer",
                        isDark
                            ? "bg-gray-800 text-white hover:bg-gray-700"
                            : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    )}
                    disabled={step === 1}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                    Anterior
                </button>

                <button
                    onClick={nextStep}
                    className={cn(
                        "px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2",
                        step === 4 ? "opacity-50 cursor-not-allowed" : "opacity-100 cursor-pointer",
                        isDark
                            ? "bg-cyan-600 text-white hover:bg-cyan-500"
                            : "bg-cyan-500 text-white hover:bg-cyan-600"
                    )}
                    disabled={step === 4}
                >
                    Próximo
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
