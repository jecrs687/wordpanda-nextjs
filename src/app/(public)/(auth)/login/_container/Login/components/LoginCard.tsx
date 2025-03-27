import { ROUTES } from '@constants/ROUTES';
import { motion } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';
import { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { FormInput } from './FormInput';
import { Submit } from './Submit';
import { ThemeToggle } from './ThemeToggle';

interface LoginCardProps {
    state: any;
    formAction: (payload: FormData | null) => void;
    theme: string | undefined;
    toggleTheme: () => void;
}

export const LoginCard = ({ state, formAction, theme, toggleTheme }: LoginCardProps) => {
    const { t } = useTranslation();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formAction(formData);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative z-10 w-full max-w-[95%] sm:max-w-md md:max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-black/30 overflow-hidden"
        >
            {/* Panda-themed top accent border */}
            <div className="w-full h-2 bg-gradient-to-r from-black via-black to-black"></div>

            <div className="p-6 sm:p-8">
                {/* Theme toggle - positioned top right */}
                <div className="absolute top-4 right-4 z-10">
                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                </div>

                {/* Logo and Title */}
                <div className="text-center mb-6 sm:mb-8">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="relative inline-block mb-4"
                    >
                        <div className="relative p-3 bg-white dark:bg-zinc-800 rounded-full shadow-md inline-flex items-center justify-center">
                            <Image
                                src="/assets/logo.png"
                                alt={t('common.appName', 'WordPanda Logo')}
                                width={120}
                                height={60}
                                className="object-contain"
                                priority
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "https://via.placeholder.com/120x60?text=WordPanda";
                                }}
                            />
                            {/* Panda ears (decorative) */}
                            <div className="absolute -top-3 -left-1 w-6 h-6 rounded-full bg-black"></div>
                            <div className="absolute -top-3 -right-1 w-6 h-6 rounded-full bg-black"></div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                    >
                        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
                            {t('auth.welcomeTo')} <span className="text-emerald-600 dark:text-emerald-400">Word</span><span className="text-black dark:text-white">Panda</span>
                        </h2>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                            {t('auth.learnLanguagesFun')}
                        </p>
                    </motion.div>
                </div>

                {/* Login Form */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="space-y-5"
                >
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                        <FormInput
                            type="text"
                            name="email"
                            title={t('auth.email')}
                            placeholder={t('auth.emailPlaceholder')}
                            error={state?.errors?.email}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                            }
                        />

                        <FormInput
                            type="password"
                            name="password"
                            title={t('auth.password')}
                            placeholder={t('auth.passwordPlaceholder')}
                            error={state?.errors?.password}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            }
                        />

                        <div className="flex justify-end">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href="#"
                                    className="text-sm font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-500 dark:hover:text-emerald-400"
                                >
                                    {t('auth.forgotPassword')}
                                </Link>
                            </motion.div>
                        </div>

                        <Submit />

                        {/* Error display */}
                        {state?.error && state.error !== "USER_NOT_ACTIVATED" && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm"
                            >
                                {state.error === "INVALID_CREDENTIALS"
                                    ? t('auth.invalidCredentials')
                                    : t('errors.generic')}
                            </motion.div>
                        )}
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            <Link
                                href={ROUTES.REGISTER()}
                                className="inline-block"
                            >
                                <motion.span
                                    whileHover={{ scale: 1.03 }}
                                    className="text-sm font-medium"
                                >
                                    {t('auth.dontHaveAccount')} <span className="underline font-semibold text-emerald-600 dark:text-emerald-400">{t('auth.registerNow')}</span>
                                </motion.span>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Panda-themed footer accent */}
            <div className="w-full h-2 bg-gradient-to-r from-emerald-500 via-emerald-500 to-emerald-500"></div>
        </motion.div>
    );
};
