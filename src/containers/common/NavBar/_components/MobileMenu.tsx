import { ROUTES } from '@constants/ROUTES';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { memo } from 'react';
import MobileNavLink from './MobileNavLink';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';

interface MobileMenuProps {
    isOpen: boolean;
    pathname: string;
    onSearch: (query: string) => void;
    showSearchBar: boolean;
    onClose: () => void;
}

const MobileMenu = ({ isOpen, pathname, onSearch, showSearchBar, onClose }: MobileMenuProps) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Animation variants for container
    const menuVariants = {
        closed: {
            height: 0,
            opacity: 0,
            transition: {
                duration: 0.3,
                height: { duration: 0.3 },
                opacity: { duration: 0.2 },
                when: "afterChildren",
                staggerChildren: 0.05,
                staggerDirection: -1
            }
        },
        open: {
            height: 'auto',
            opacity: 1,
            transition: {
                duration: 0.4,
                height: { duration: 0.4 },
                opacity: { duration: 0.3, delay: 0.1 },
                when: "beforeChildren",
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    // Animation variants for children
    const itemVariants = {
        closed: { opacity: 0, y: -10 },
        open: { opacity: 1, y: 0 }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={menuVariants}
                    className={`md:hidden overflow-hidden mt-3 py-4 rounded-xl border
                        ${isDark
                            ? 'bg-gray-900/95 backdrop-blur-xl border-gray-800/70 shadow-lg shadow-black/20'
                            : 'bg-white/95 backdrop-blur-xl border-gray-200/70 shadow-md shadow-black/5'
                        }`}
                >
                    <motion.nav className="flex flex-col gap-2 px-2 mb-4">
                        <MobileNavLink
                            href={ROUTES.DASHBOARD()}
                            isActive={pathname === ROUTES.DASHBOARD()}
                            onClick={onClose}
                            icon="dashboard"
                            variants={itemVariants}
                        >
                            Dashboard
                        </MobileNavLink>
                        <MobileNavLink
                            href={ROUTES.LANGUAGES()}
                            isActive={pathname.startsWith('/languages')}
                            onClick={onClose}
                            icon="languages"
                            variants={itemVariants}
                        >
                            Idiomas
                        </MobileNavLink>
                        <MobileNavLink
                            href={ROUTES.PROFILE()}
                            isActive={pathname === ROUTES.PROFILE()}
                            onClick={onClose}
                            icon="profile"
                            variants={itemVariants}
                        >
                            Perfil
                        </MobileNavLink>
                    </motion.nav>

                    <motion.div
                        className="mt-3 space-y-4 px-3 border-t border-gray-200 dark:border-gray-800 pt-4"
                        variants={itemVariants}
                    >
                        {showSearchBar && (
                            <div className="mb-4">
                                <SearchBar onChange={onSearch} />
                            </div>
                        )}

                        <div className="flex justify-center py-2">
                            <ThemeToggle />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default memo(MobileMenu);
