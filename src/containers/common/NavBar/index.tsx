"use client";
import useSearch from '@hooks/useSearch';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import { memo, useCallback, useState } from 'react';
import MobileMenu from './_components/MobileMenu';
import NavbarActions from './_components/NavbarActions';
import NavbarBrand from './_components/NavbarBrand';
import NavbarLinks from './_components/NavbarLinks';

type NavbarProps = {
    onSearch?: (query: string) => void;
    transparent?: boolean;
};

const Navbar = ({ onSearch, transparent = false }: NavbarProps) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { setSearch } = useSearch();

    // Memoize the search handler for better performance
    const handleSearch = useCallback((query: string) => {
        if (onSearch) {
            onSearch(query);
            setSearch(query);
        }
    }, [onSearch, setSearch]);

    // Memoize the mobile menu toggle for better performance
    const toggleMobileMenu = useCallback((state: boolean) => {
        setMobileMenuOpen(state);
    }, []);

    return (
        <header className={`sticky top-0 z-50 w-full backdrop-blur-xl transition-colors duration-300
            ${transparent
                ? isDark
                    ? 'bg-transparent border-transparent'
                    : 'bg-transparent border-transparent'
                : isDark
                    ? 'bg-gray-950/90 border-b border-gray-800/70 shadow-lg shadow-black/10'
                    : 'bg-white/95 border-b border-zinc-200/70 shadow-sm shadow-black/5'
            }`}
        >
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo and Navigation */}
                    <div className="flex items-center gap-6 lg:gap-8">
                        <NavbarBrand />
                        <NavbarLinks pathname={pathname} />
                    </div>

                    {/* Right side actions */}
                    <NavbarActions
                        onSearch={handleSearch}
                        showSearchBar={!!onSearch}
                        mobileMenuOpen={mobileMenuOpen}
                        setMobileMenuOpen={toggleMobileMenu}
                    />
                </div>

                {/* Mobile menu */}
                <MobileMenu
                    isOpen={mobileMenuOpen}
                    pathname={pathname}
                    onSearch={handleSearch}
                    showSearchBar={!!onSearch}
                    onClose={() => toggleMobileMenu(false)}
                />
            </div>
        </header>
    );
};

export default memo(Navbar);
