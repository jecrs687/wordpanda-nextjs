'use client';

import { ROUTES } from '@constants/ROUTES';
import { cn } from '@utils/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export const MarketingHeader = () => {
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark';
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { name: 'Funcionalidades', href: '/marketing/features' },
        { name: 'Jogos', href: '/marketing/games' },
        { name: 'Demonstração', href: '/marketing/interactive-demo' },
        { name: 'Depoimentos', href: '/marketing/testimonials' },
    ];

    return (
        <header className={cn(
            "sticky top-0 z-50 w-full backdrop-blur-lg transition-colors duration-500",
            isDark
                ? "bg-gray-950/75 border-b border-gray-800/50"
                : "bg-white/75 border-b border-gray-200/50"
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16 md:h-20">
                    <div className="flex items-center">
                        <Link href={ROUTES.DASHBOARD()} className="flex items-center gap-2">
                            <motion.div
                                className="relative"
                                whileHover={{ scale: 1.05, rotate: [0, -5, 0, 5, 0] }}
                                transition={{ duration: 0.5 }}
                            >
                                <span className="text-2xl md:text-3xl filter drop-shadow-md">🐼</span>
                                <motion.div
                                    className={`absolute -inset-2 rounded-full ${isDark ? 'bg-emerald-500' : 'bg-emerald-300'}`}
                                    initial={{ opacity: 0, scale: 0.6 }}
                                    whileHover={{
                                        opacity: 0.15,
                                        scale: 1.2,
                                        transition: { duration: 0.3 }
                                    }}
                                />
                            </motion.div>

                            <h1 className="text-lg md:text-xl font-bold tracking-tight">
                                <span className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>Word</span>
                                <span>Panda</span>
                            </h1>
                        </Link>
                    </div>

                    {/* Desktop navigation */}
                    <div className="hidden md:flex md:items-center md:gap-6">
                        <nav className="flex gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                        pathname === item.href
                                            ? (isDark
                                                ? "bg-gray-800 text-white"
                                                : "bg-gray-100 text-gray-900")
                                            : (isDark
                                                ? "text-gray-300 hover:text-white hover:bg-gray-800/70"
                                                : "text-gray-700 hover:text-gray-900 hover:bg-gray-100")
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>

                        <div className="flex items-center gap-3">
                            <Link
                                href="/login"
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                    isDark
                                        ? "text-gray-300 hover:text-white hover:bg-gray-800/70"
                                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                                )}
                            >
                                Entrar
                            </Link>

                            <Link
                                href="/register"
                                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 shadow-sm hover:shadow-emerald-500/25 transition-all duration-200"
                            >
                                Cadastrar
                            </Link>
                        </div>

                        <button
                            onClick={() => setTheme(isDark ? "light" : "dark")}
                            className={cn(
                                "p-2 rounded-full transition-colors duration-200",
                                isDark
                                    ? "bg-gray-800 text-gray-300 hover:text-white"
                                    : "bg-gray-100 text-gray-700 hover:text-gray-900"
                            )}
                            aria-label="Toggle theme"
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            onClick={() => setTheme(isDark ? "light" : "dark")}
                            className={cn(
                                "p-2 rounded-full transition-colors duration-200",
                                isDark
                                    ? "bg-gray-800 text-gray-300 hover:text-white"
                                    : "bg-gray-100 text-gray-700 hover:text-gray-900"
                            )}
                            aria-label="Toggle theme"
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className={cn(
                                "p-2 rounded-full transition-colors duration-200",
                                isDark
                                    ? "bg-gray-800 text-gray-300 hover:text-white"
                                    : "bg-gray-100 text-gray-700 hover:text-gray-900"
                            )}
                            aria-label="Open menu"
                        >
                            <Menu size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 md:hidden"
                    >
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25 }}
                            className={cn(
                                "fixed top-0 right-0 bottom-0 w-full max-w-xs p-6 overflow-y-auto",
                                isDark ? "bg-gray-900" : "bg-white"
                            )}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <Link
                                    href={ROUTES.DASHBOARD()}
                                    className="flex items-center gap-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span className="text-2xl filter drop-shadow-md">🐼</span>
                                    <h1 className="text-lg font-bold tracking-tight">
                                        <span className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>Word</span>
                                        <span>Panda</span>
                                    </h1>
                                </Link>

                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "p-2 rounded-full transition-colors duration-200",
                                        isDark
                                            ? "bg-gray-800 text-gray-300 hover:text-white"
                                            : "bg-gray-100 text-gray-700 hover:text-gray-900"
                                    )}
                                    aria-label="Close menu"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <nav className="flex flex-col gap-2 mb-8">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={cn(
                                            "px-4 py-3 rounded-lg text-base font-medium transition-all duration-200",
                                            pathname === item.href
                                                ? (isDark
                                                    ? "bg-gray-800 text-white"
                                                    : "bg-gray-100 text-gray-900")
                                                : (isDark
                                                    ? "text-gray-300 hover:text-white hover:bg-gray-800/70"
                                                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100")
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>

                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "px-4 py-3 rounded-lg text-center text-base font-medium transition-all duration-200",
                                        isDark
                                            ? "bg-gray-800 text-white"
                                            : "bg-gray-100 text-gray-900"
                                    )}
                                >
                                    Entrar
                                </Link>

                                <Link
                                    href="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-4 py-3 rounded-lg text-center text-base font-medium text-white bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-sm transition-all duration-200"
                                >
                                    Cadastrar
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};
