import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { memo } from 'react';
import { NavIcons } from './NavIcons';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';

interface NavbarActionsProps {
    onSearch: (query: string) => void;
    showSearchBar: boolean;
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
}

const NavbarActions = ({
    onSearch,
    showSearchBar,
    mobileMenuOpen,
    setMobileMenuOpen
}: NavbarActionsProps) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const router = useRouter();

    const User = NavIcons.profile;
    const Menu = NavIcons.menu;
    const Close = NavIcons.close;

    // Button animation variants
    const buttonVariants = {
        hover: {
            scale: 1.05,
            boxShadow: isDark
                ? '0 4px 12px rgba(16, 185, 129, 0.2)'
                : '0 4px 12px rgba(5, 150, 105, 0.2)',
        },
        tap: { scale: 0.95 }
    };

    return (
        <div className="flex items-center gap-3 md:gap-4">
            {/* Search Bar - Desktop Only */}
            {showSearchBar && (
                <div className="hidden sm:block w-60 lg:w-64">
                    <SearchBar onChange={onSearch} />
                </div>
            )}

            {/* Theme Toggle - Desktop Only */}
            <div className="hidden md:block">
                <ThemeToggle />
            </div>


            {/* Mobile Menu Toggle */}
            <motion.button
                className={`p-2.5 rounded-lg md:hidden ${isDark ? 'bg-gray-800/80' : 'bg-gray-100'}`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 500, damping: 17 }}
                aria-label="Toggle mobile menu"
            >
                {mobileMenuOpen ? (
                    <Close size={20} />
                ) : (
                    <Menu size={20} />
                )}
            </motion.button>
        </div>
    );
};

export default memo(NavbarActions);
