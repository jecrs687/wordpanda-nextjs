"use client";
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface RegistrationLayoutProps {
    children: ReactNode;
}

export const RegistrationLayout = ({ children }: RegistrationLayoutProps) => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-zinc-50 to-sky-50 dark:from-zinc-950 dark:to-blue-950">
            <div className="container mx-auto py-6 md:py-12 px-4 sm:px-6">
                <div className="flex flex-col items-center">
                    {/* Logo */}
                    <div className="mb-8 md:mb-12">
                        <div className="flex items-center gap-3">
                            <span className="text-4xl">🐼</span>
                            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
                                WordPanda
                            </h1>
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="w-full max-w-4xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-5 md:p-8 border border-zinc-200 dark:border-zinc-800">
                        {children}
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-sm text-center text-zinc-500 dark:text-zinc-400">
                        <p>© {currentYear} WordPanda. {t('register.footer.rights')}</p>
                        <div className="mt-2 flex justify-center gap-4">
                            <a href="#" className="hover:text-emerald-500 transition-colors">{t('register.footer.privacy')}</a>
                            <a href="#" className="hover:text-emerald-500 transition-colors">{t('register.footer.terms')}</a>
                            <a href="#" className="hover:text-emerald-500 transition-colors">{t('register.footer.help')}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
