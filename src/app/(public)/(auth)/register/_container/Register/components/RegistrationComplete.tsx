import { ROUTES } from '@constants/ROUTES';
import { useMediaQuery } from '@hooks/useMediaQuery';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { FormButton } from './FormButton';

export function RegistrationComplete() {
    const prefersReducedMotion = useReducedMotion();
    const isMobile = useMediaQuery('(max-width: 640px)');
    const { t } = useTranslation();

    // Confetti elements
    const confettiElements = !prefersReducedMotion ? Array.from({ length: 60 }).map((_, i) => {
        const size = Math.random() * 8 + 4;
        const color = [
            'bg-emerald-500',
            'bg-cyan-500',
            'bg-indigo-500',
            'bg-yellow-500',
            'bg-rose-500',
        ][Math.floor(Math.random() * 5)];

        return (
            <motion.div
                key={i}
                className={`absolute rounded-sm ${color} z-0`}
                style={{
                    width: size,
                    height: size,
                    top: '50%',
                    left: '50%',
                }}
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{
                    x: (Math.random() - 0.5) * 300,
                    y: (Math.random() - 0.5) * 300,
                    opacity: [0, 1, 0],
                    rotate: Math.random() * 360,
                }}
                transition={{
                    duration: 2.5,
                    ease: "easeOut",
                    delay: Math.random() * 0.5,
                }}
            />
        );
    }) : null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6 sm:py-8 relative overflow-hidden"
        >
            {/* Confetti animation */}
            {confettiElements}

            {/* Success icon */}
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", damping: 8 }}
                className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-6 sm:mb-8"
            >
                {/* Glow effect */}
                <motion.div
                    className="absolute inset-0 rounded-full bg-emerald-400/40 dark:bg-emerald-500/30 blur-xl z-0"
                    animate={{
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "mirror"
                    }}
                />

                {/* Circle background */}
                <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 dark:from-emerald-500 dark:to-cyan-500 relative z-10 flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, rotateY: [0, 360] }}
                        transition={{ delay: 0.5, type: "spring", damping: 10, duration: 1 }}
                    >
                        <svg
                            className="w-12 h-12 sm:w-14 sm:h-14 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </motion.div>
                </div>
            </motion.div>

            {/* Success message */}
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl sm:text-3xl font-bold mb-3 text-gradient-primary"
            >
                {t('register.complete.title')}
            </motion.h2>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto"
            >
                {t('register.complete.description')}
            </motion.p>

            {/* Email verification notice */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 max-w-md mx-auto mb-6"
            >
                <div className="flex items-start space-x-3">
                    <div className="text-indigo-500 dark:text-indigo-400 mt-0.5">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300 text-left">
                        {t('register.complete.verificationMessage')}
                    </p>
                </div>
            </motion.div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex-1"
                >
                    <FormButton
                        fullWidth
                        onClick={() => window.location.reload()}
                        icon={
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        }
                    >
                        {t('register.complete.buttons.dashboard')}
                    </FormButton>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex-1"
                >
                    <Link href={ROUTES.LOGIN()}>
                        <FormButton
                            variant="outline"
                            fullWidth
                            icon={
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                            }
                        >
                            {t('register.complete.buttons.signIn')}
                        </FormButton>
                    </Link>
                </motion.div>
            </div>
        </motion.div>
    );
}
