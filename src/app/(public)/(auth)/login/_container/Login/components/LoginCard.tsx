import { ROUTES } from '@constants/ROUTES';
import { motion } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';
import { FormEvent } from "react";
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
                                alt="WordPanda Logo"
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
                            Bem-vindo ao <span className="text-emerald-600 dark:text-emerald-400">Word</span><span className="text-black dark:text-white">Panda</span>
                        </h2>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                            Aprenda idiomas de forma divertida e interativa!
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

                        {/* Error display */}
                        {state?.error && state.error !== "USER_NOT_ACTIVATED" && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm"
                            >
                                {state.error === "INVALID_CREDENTIALS"
                                    ? "Email ou senha inválidos"
                                    : "Ocorreu um erro. Tente novamente."}
                            </motion.div>
                        )}
                    </form>

                    {/* Social Login Section */}
                    {/* <div className="mt-6 sm:mt-8">
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

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <SocialLoginButton
                                type="google"
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
                                type="apple"
                                icon={
                                    <svg className="h-5 w-5 text-zinc-700 dark:text-zinc-200" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
                                    </svg>
                                }
                            />
                        </div>
                    </div> */}

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
                                    Não tem uma conta? <span className="underline font-semibold text-emerald-600 dark:text-emerald-400">Registre-se agora</span>
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
