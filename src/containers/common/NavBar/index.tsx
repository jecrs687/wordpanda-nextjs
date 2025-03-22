"use client";
import TextSearch from '@common/TextSearch';
import { ROUTES } from '@constants/ROUTES';
import useSearch from '@hooks/useSearch';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

type NavbarProps = {
    onSearch?: (query: string) => void;
    transparent?: boolean;
};

const Navbar = ({ onSearch, transparent = false }: NavbarProps) => {
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark';
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { search, setSearch } = useSearch();

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onSearch) {
            onSearch(e.target.value);
            setSearch(e.target.value);
        }
    };

    return (
        <header className={`sticky top-0 z-50 w-full backdrop-blur-xl 
      ${transparent
                ? isDark
                    ? 'bg-black/0 border-gray-800/0'
                    : 'bg-white/0 border-zinc-200/0'
                : isDark
                    ? 'bg-black/40 border-b border-gray-800/70 shadow-lg shadow-black/10'
                    : 'bg-white/70 border-b border-zinc-200/70 shadow-sm shadow-black/5'
            }`}
        >
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo and Navigation */}
                    <div className="flex items-center gap-8">
                        <Link href="/dashboard" passHref>
                            <motion.div
                                className="flex items-center gap-2"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="text-2xl md:text-3xl">🐼</div>
                                <h1 className={`text-lg md:text-xl font-bold 
                  ${isDark
                                        ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent'
                                        : 'bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent'}`}
                                >
                                    WordPanda
                                </h1>
                            </motion.div>
                        </Link>

                        <nav className="hidden md:flex items-center gap-6">
                            <NavLink href={ROUTES.DASHBOARD()} isActive={pathname === '/dashboard'}>Dashboard</NavLink>
                            <NavLink href={ROUTES.LANGUAGES()} isActive={pathname.startsWith('/languages')}>Idiomas</NavLink>
                            {/* <NavLink href={} isActive={pathname.startsWith('/explore')}>Explorar</NavLink> */}
                            {/* <NavLink href="/learning" isActive={pathname.startsWith('/learning')}>Aprender</NavLink> */}
                        </nav>
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center gap-4">
                        {onSearch && (
                            <div className="hidden sm:block w-64">
                                <TextSearch
                                    placeholder="Buscar..."
                                    onChange={handleSearch}
                                    iconRight={() => (
                                        <motion.button
                                            whileHover={{ scale: 1.1, rotate: 15 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setTheme(isDark ? 'light' : 'dark')}
                                            className={`p-2 rounded-full transition-colors
                        ${isDark
                                                    ? 'text-amber-300 hover:bg-gray-800/80'
                                                    : 'text-violet-500 hover:bg-gray-100/80'}`}
                                        >
                                            {isDark ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                                </svg>
                                            )}
                                        </motion.button>
                                    )}
                                />
                            </div>
                        )}

                        <div className="hidden md:flex items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`flex items-center gap-2 py-2 px-4 rounded-xl text-sm font-medium
                  ${isDark
                                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                                onClick={() => router.push(ROUTES.PROFILE())}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>Perfil</span>
                            </motion.button>


                        </div>

                        {/* Mobile menu toggle */}
                        <motion.button
                            className="p-2 rounded-lg md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </motion.button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden mt-4 py-4 border-t border-gray-100 dark:border-gray-800"
                    >
                        <nav className="flex flex-col gap-4">
                            <MobileNavLink
                                href={ROUTES.DASHBOARD()}
                                isActive={pathname === ROUTES.DASHBOARD()}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Dashboard
                            </MobileNavLink>
                            <MobileNavLink
                                href={ROUTES.LANGUAGES()}
                                isActive={pathname.startsWith('/languages')}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Idiomas
                            </MobileNavLink>
                            {/* <MobileNavLink
                                href="/explore"
                                isActive={pathname.startsWith('/explore')}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Explorar
                            </MobileNavLink>
                            <MobileNavLink
                                href="/learning"
                                isActive={pathname.startsWith('/learning')}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Aprender
                            </MobileNavLink> */}
                        </nav>

                        <div className="mt-4 space-y-3">
                            {onSearch && (
                                <TextSearch
                                    placeholder="Buscar..."
                                    onChange={handleSearch}
                                />
                            )}

                            <div className="flex flex-col gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`flex items-center gap-2 py-2 px-4 rounded-xl text-sm font-medium
                    ${isDark
                                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                                    onClick={() => router.push(ROUTES.PROFILE())}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>Perfil</span>
                                </motion.button>

                                {/* <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`flex items-center gap-2 py-2 px-4 rounded-xl font-medium 
                    ${isDark
                                            ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white'
                                            : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span>Novo Estudo</span>
                                </motion.button> */}

                                <button
                                    onClick={() => setTheme(isDark ? 'light' : 'dark')}
                                    className={`flex items-center gap-2 py-2 px-4 rounded-xl text-sm font-medium
                    ${isDark
                                            ? 'bg-gray-800 hover:bg-gray-700 text-amber-300'
                                            : 'bg-gray-100 hover:bg-gray-200 text-violet-500'}`}
                                >
                                    {isDark ? (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                            <span>Modo claro</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                            </svg>
                                            <span>Modo escuro</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </header>
    );
};

// NavLink component with active state support
type NavLinkProps = {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
    isActive?: boolean;
};

const NavLink = ({ href, children, isActive = false }: NavLinkProps) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <Link href={href} passHref>
            <motion.div
                className={`relative px-3 py-2 text-sm font-medium rounded-lg ${isActive
                    ? isDark ? 'text-emerald-400' : 'text-emerald-600'
                    : isDark ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                    }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
            >
                {children}
                <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full`}
                    initial={{ width: isActive ? '70%' : 0, left: '50%', x: '-50%' }}
                    animate={{ width: isActive ? '70%' : 0 }}
                    whileHover={{ width: '70%' }}
                    transition={{ type: "tween", duration: 0.3 }}
                />
            </motion.div>
        </Link>
    );
};

// Mobile NavLink component with active state support
const MobileNavLink = ({ href, children, onClick, isActive = false }: NavLinkProps) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <Link href={href} passHref>
            <motion.p
                className={`block px-4 py-2 text-base font-medium rounded-lg ${isActive
                    ? isDark ? 'bg-gray-800 text-emerald-400' : 'bg-gray-100 text-emerald-600'
                    : isDark ? 'text-gray-200 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                onClick={onClick}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
            >
                {children}
            </motion.p>
        </Link>
    );
};

export default Navbar;
