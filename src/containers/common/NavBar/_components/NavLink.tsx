import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { memo } from 'react';
import { NavIcons } from './NavIcons';

type NavLinkProps = {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
    isActive?: boolean;
    icon?: keyof typeof NavIcons;
};

const NavLink = ({ href, children, isActive = false, icon }: NavLinkProps) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const IconComponent = icon ? NavIcons[icon] : null;

    // Animation variants for the link
    const linkVariants = {
        hover: {
            scale: 1.04,
            transition: { type: "spring", stiffness: 500, damping: 17 }
        },
        tap: { scale: 0.96 }
    };

    // Animation variants for the underline indicator
    const indicatorVariants = {
        initial: {
            width: isActive ? '70%' : '0%',
            left: '50%',
            x: '-50%',
            opacity: isActive ? 1 : 0
        },
        hover: {
            width: '70%',
            opacity: 1,
            transition: { type: "spring", stiffness: 500, damping: 25 }
        }
    };

    return (
        <Link href={href} className="relative group">
            <motion.div
                className={`relative px-3 py-2 flex items-center gap-2 text-sm font-medium rounded-lg transition-colors
                    ${isActive
                        ? isDark ? 'text-emerald-400' : 'text-emerald-600'
                        : isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                    }`}
                variants={linkVariants}
                whileHover="hover"
                whileTap="tap"
            >
                {IconComponent && (
                    <motion.span
                        className={`flex items-center justify-center ${isActive ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : ''}`}
                        animate={{ y: isActive ? [0, -2, 0] : 0 }}
                        transition={{ repeat: 0, duration: 0.4 }}
                    >
                        <IconComponent size={18} strokeWidth={2} />
                    </motion.span>
                )}
                <span>{children}</span>

                {/* Active/hover indicator */}
                <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${isActive
                        ? (isDark ? 'bg-emerald-400' : 'bg-emerald-500')
                        : (isDark ? 'bg-emerald-500/80' : 'bg-emerald-500')
                        } rounded-full`}
                    variants={indicatorVariants}
                    initial="initial"
                    animate="initial"
                    whileHover="hover"
                />
            </motion.div>
        </Link>
    );
};

export default memo(NavLink);
