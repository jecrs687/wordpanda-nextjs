"use client";

import { TOKEN_KEY } from '@constants/CONFIGS';
import { ROUTES } from '@constants/ROUTES';
import { Input, Label } from '@core/ui';
import { useChannels } from '@hooks/useChannels';
import useDevice from '@hooks/useDevice';
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from "react-dom";
import { submit } from './action';

// Enhanced form input with animations and better error handling
const FormInput = ({
    type,
    name,
    title,
    placeholder,
    error,
    icon,
}: {
    type: string;
    name: string;
    title: string;
    placeholder?: string;
    error?: string;
    icon?: React.ReactNode;
}) => {
    const [focused, setFocused] = useState(false);

    return (
        <div className="space-y-3">
            <Label
                htmlFor={name}
                className="flex items-center text-sm font-medium text-zinc-900 dark:text-white"
            >
                {icon && <span className="mr-2">{icon}</span>}
                {title}
            </Label>
            <div className="relative">
                <motion.div
                    animate={{
                        scale: focused ? 1.01 : 1,
                        borderColor: focused ? 'rgb(16, 185, 129)' : 'transparent',
                    }}
                    className="rounded-xl overflow-hidden"
                >
                    <Input
                        type={type}
                        id={name}
                        name={name}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        className={`w-full px-4 py-3.5 bg-white dark:bg-zinc-800 border ${error
                            ? 'border-rose-500 ring-1 ring-rose-500'
                            : 'border-zinc-300 dark:border-zinc-600'
                            } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-900 dark:text-white transition-all duration-300`}
                        placeholder={placeholder}
                    />
                </motion.div>
                <AnimatePresence>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute text-xs font-medium text-rose-500 mt-1.5"
                        >
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// Enhanced submit button with better animations
const Submit = () => {
    const { pending } = useFormStatus();

    return (
        <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={pending}
            className={`w-full py-4 px-5 rounded-xl font-semibold text-white transition-all duration-300 ${pending
                ? 'bg-emerald-700 cursor-not-allowed opacity-80'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20'
                }`}
        >
            <motion.div
                initial={false}
                animate={{
                    y: pending ? [0, -3, 0] : 0,
                }}
                transition={{
                    repeat: pending ? Infinity : 0,
                    duration: 1.5,
                }}
                className="flex justify-center items-center"
            >
                {pending ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Entrando...</span>
                    </>
                ) : (
                    <>
                        <span className="mr-1">Entrar</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </>
                )}
            </motion.div>
        </motion.button>
    );
};

// Social login button component
const SocialLoginButton = ({ icon, label, onClick }: { icon: React.ReactNode, label?: string, onClick?: () => void }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={onClick}
            className="flex items-center justify-center py-3.5 px-5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all duration-300 shadow-sm hover:shadow-md"
        >
            <span className="flex items-center">
                {icon}
                {label && <span className="ml-2 text-zinc-700 dark:text-zinc-200 font-medium">{label}</span>}
            </span>
        </motion.button>
    );
};

// Theme toggle button with animations
const ThemeToggle = ({ theme, toggleTheme }: { theme: string | undefined, toggleTheme: () => void }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="flex items-center justify-center p-2 rounded-full bg-white dark:bg-zinc-800 shadow-md hover:shadow-lg transition-all duration-300"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={theme}
                    initial={{ opacity: 0, rotate: -180 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                >
                    {theme === 'dark' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                    )}
                </motion.div>
            </AnimatePresence>
        </motion.button>
    );
};

// Decorative background elements
const BackgroundElements = () => (
    <>
        <div className="absolute inset-0 z-0 overflow-hidden">
            <motion.div
                className="absolute -top-48 -right-48 w-96 h-96 bg-emerald-500/20 rounded-full filter blur-3xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute -bottom-48 -left-48 w-96 h-96 bg-indigo-500/20 rounded-full filter blur-3xl"
                animate={{ rotate: -360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            />
        </div>
        <div className="hidden dark:block absolute inset-0 z-0">
            <div className="absolute top-[25%] left-[15%] w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '4s' }} />
            <div className="absolute top-[40%] left-[80%] w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s', animationDuration: '5s' }} />
            <div className="absolute top-[70%] left-[25%] w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '6s' }} />
            <div className="absolute top-[15%] left-[70%] w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.7s', animationDuration: '3s' }} />
            <div className="absolute top-[60%] left-[60%] w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '2s', animationDuration: '4.5s' }} />
        </div>
    </>
);

export default function LoginPage() {
    const [state, formAction] = useActionState(submit, {});
    const { extension } = useDevice();
    const router = useRouter();
    const { web } = useChannels();
    const { theme, setTheme } = useTheme();
    const [loading, setLoading] = useState(true);

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
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-zinc-100 dark:from-zinc-900 dark:to-black transition-colors duration-500 py-16 px-6 sm:px-8 lg:px-10">
            <BackgroundElements />

            {/* Glass card container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full max-w-lg bg-white/90 dark:bg-zinc-900/80 backdrop-blur-xl p-8 sm:p-10 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-emerald-500/5 p-10 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-emerald-500/5"
            >
                {/* Theme toggle - positioned top right */}
                <div className="absolute top-4 right-4">
                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                </div>

                {/* Logo and Title */}
                <div className="text-center mb-8 ">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="relative inline-block mb-4"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-indigo-500/30 rounded-full filter blur-md"></div>
                        <div className="relative bg-white dark:bg-zinc-800 p-4 rounded-full shadow-lg">
                            <Image
                                src="/assets/logo.png"
                                alt="WordPanda Logo"
                                width={130}
                                height={70}
                                className="object-contain mx-auto"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "https://via.placeholder.com/130x70?text=WordPanda";
                                }}
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                    >
                        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-indigo-400">
                            Acessar WordPanda
                        </h2>
                        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
                            Aprenda idiomas de forma divertida e interativa!
                        </p>
                    </motion.div>
                </div>

                {/* Login Form */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <form action={formAction} className="space-y-6 ">
                        <FormInput
                            type="text"
                            name="email"
                            title="Email"
                            placeholder="Digite seu email"
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
                            title="Senha"
                            placeholder="Digite sua senha"
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
                                    Esqueceu a senha?
                                </Link>
                            </motion.div>
                        </div>

                        <Submit />
                    </form>

                    {/* Social Login Section */}
                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-zinc-200 dark:border-zinc-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-3 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 rounded-full">
                                    Ou continue com
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <SocialLoginButton
                                icon={
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                }
                            />
                            <SocialLoginButton
                                icon={
                                    <svg className="h-5 w-5 text-zinc-700 dark:text-zinc-200" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
                                    </svg>
                                }
                            />
                        </div>
                    </div>

                    {/* Register Link */}
                    <div className="mt-10 text-center">
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
                                    className="bg-gradient-to-r from-indigo-500 to-sky-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-sky-400 text-sm font-medium"
                                >
                                    Não tem uma conta? <span className="underline font-semibold">Registre-se agora</span>
                                </motion.span>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Version number */}
            <div className="absolute bottom-4 text-xs text-zinc-500 dark:text-zinc-600">
                WordPanda v1.0
            </div>
        </div>
    );
}
