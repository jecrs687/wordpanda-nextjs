import { motion, Variants } from 'framer-motion';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { memo } from 'react';
import { NavIcons } from './NavIcons';

type MobileNavLinkProps = {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
    isActive?: boolean;
    icon?: keyof typeof NavIcons;
    variants?: Variants;
};

const MobileNavLink = ({
    href,
    children,
    onClick,
    isActive = false,
    icon,
    variants
}: MobileNavLinkProps) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const IconComponent = icon ? NavIcons[icon] : null;

    // Animation variants for the link
    const linkVariants = {
        hover: { x: 6, transition: { duration: 0.2 } },
        tap: { scale: 0.98 }
    };

    return (
        <motion.div variants={variants}>
            <Link href={href} className="block" onClick={onClick}>
                <motion.div
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                        ${isActive
                            ? isDark
                                ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500'
                                : 'bg-emerald-50 text-emerald-700 border-l-2 border-emerald-500'
                            : isDark
                                ? 'text-gray-300 hover:bg-gray-800/70 hover:text-white'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                    variants={linkVariants}
                    whileHover="hover"
                    whileTap="tap"
                >
                    {IconComponent && (
                        <span className={`flex items-center justify-center ${isActive
                            ? (isDark ? 'text-emerald-400' : 'text-emerald-600')
                            : ''}`}
                        >
                            <IconComponent size={20} />
                        </span>
                    )}
                    <span>{children}</span>
                </motion.div>
            </Link>
        </motion.div>
    );
};

export default memo(MobileNavLink);
