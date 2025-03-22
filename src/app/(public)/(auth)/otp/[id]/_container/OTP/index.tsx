"use client";
import { otpSubmit, resendOtp } from '@actions/Word/otpValidations.action';
import { TOKEN_KEY } from '@constants/CONFIGS';
import { ROUTES } from '@constants/ROUTES';
import { setCookie } from '@utils/cookie';
import { useRouter } from 'next/navigation';
import { startTransition, useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import OtpActions from './components/OtpActions';
import OtpFooter from './components/OtpFooter';
import OtpHeader from './components/OtpHeader';
import OtpInputSection from './components/OtpInputSection';

export default function OtpConfirmation({ id }) {
    const [state, formAction] = useActionState(otpSubmit, {});
    const status = useFormStatus();
    const [time, setTime] = useState(0);
    const router = useRouter();
    const [values, setValues] = useState<{ id: string, otp?: string }>({ id });
    const formRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const startCooldownTimer = () => {
        setTime(1);
        const interval = setInterval(() => setTime(prev => prev - 1), 1000);
        setTimeout(() => {
            clearInterval(interval);
            setTime(0);
        }, 1000);
    };

    useEffect(() => {
        if (state.token) {
            localStorage.setItem(TOKEN_KEY, state.token);
            setCookie(TOKEN_KEY, state.token);
            router.push(ROUTES.DASHBOARD());
        }
    }, [state, router]);

    useEffect(() => {
        if (values?.otp?.length === 4) {
            setIsSubmitting(true);

            // Use startTransition to wrap the formAction call
            startTransition(() => {
                const form = new FormData();
                form.set('otp', values.otp);
                form.set('id', values.id);
                const result = formAction(form);
                Promise.resolve(result).finally(() => setIsSubmitting(false));
            });
        }
    }, [formAction, values]);

    const handleResendOtp = () => {
        resendOtp({ id });
        startCooldownTimer();
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all">
                <form
                    action={formAction}
                    ref={formRef}
                    className="flex flex-col p-6 md:p-8 space-y-6"
                >
                    <input type="hidden" name="id" value={values.id} />
                    {values.otp && <input type="hidden" name="otp" value={values.otp} />}

                    <OtpHeader />

                    <OtpInputSection
                        error={state.errors?.otp}
                        onOtpSubmit={(otp) => setValues(prev => ({ ...prev, otp }))}
                        isLoading={isSubmitting || status.pending}
                    />

                    <OtpActions
                        isSubmitting={isSubmitting || status.pending}
                        cooldownTime={time}
                        onResendOtp={handleResendOtp}
                    />

                    <OtpFooter />
                </form>
            </div>
        </main>
    );
}
