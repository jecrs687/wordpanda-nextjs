"use client";

import { TOKEN_KEY } from '@constants/CONFIGS';
import { ROUTES } from '@constants/ROUTES';
import { useChannels } from '@hooks/useChannels';
import useDevice from '@hooks/useDevice';
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { submit } from './action';
import { BackgroundElements } from './components/BackgroundElements';
import { LoginCard } from './components/LoginCard';


export default function LoginPage() {
    const [state, formAction] = useActionState(submit, {});
    const { extension } = useDevice();
    const router = useRouter();
    const { web } = useChannels();
    const { theme, setTheme } = useTheme();
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    // Handle loading state and authentication
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);

        if (state.admin)
            localStorage.setItem('admin', state.admin);

        if (state.token) {
            localStorage.setItem(TOKEN_KEY, state.token);
            web.setToken(state.token);
            router.push(extension ? ROUTES.EXTENSION_GAMES() : ROUTES.DASHBOARD());
        }

        if (state.error === "USER_NOT_ACTIVATED")
            router.push(ROUTES.OTP(state.id));

        return () => clearTimeout(timer);
    }, [state, router, web, extension]);

    const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-900 transition-colors duration-500 py-6 px-4 sm:px-6 lg:px-8">
            <BackgroundElements />

            <AnimatePresence>
                {loading ? (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-zinc-900"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                repeatType: "loop"
                            }}
                            className="relative w-20 h-20"
                        >
                            {/* Panda face loader */}
                            <div className="absolute inset-0 rounded-full bg-white dark:bg-zinc-800"></div>
                            <div className="absolute top-2 left-3 w-3 h-3 rounded-full bg-black"></div>
                            <div className="absolute top-2 right-3 w-3 h-3 rounded-full bg-black"></div>
                            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-5 h-3 bg-black rounded-full"></div>
                            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 border-t-4 border-emerald-500 rounded-full animate-spin"></div>
                        </motion.div>
                    </motion.div>
                ) : (
                    <LoginCard
                        state={state}
                        formAction={formAction}
                        theme={theme}
                        toggleTheme={toggleTheme}
                    />
                )}
            </AnimatePresence>

            {/* Version number */}
            <div className="absolute bottom-2 text-xs text-zinc-500 dark:text-zinc-600">
                {t('common.appName')} v1.0
            </div>
        </div>
    );
}
