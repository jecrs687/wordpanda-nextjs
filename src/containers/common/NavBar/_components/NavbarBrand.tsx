import { ROUTES } from '@constants/ROUTES';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { memo } from 'react';

const NavbarBrand = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Animation variants for logo
    const logoVariants = {
        hover: {
            scale: 1.05,
            rotate: [0, -5, 0, 5, 0],
            transition: {
                rotate: { repeat: 0, duration: 0.5 },
                scale: { duration: 0.2 }
            }
        },
        tap: { scale: 0.95 }
    };

    // Animation variants for the highlight circle
    const highlightVariants = {
        initial: { opacity: 0, scale: 0.6 },
        hover: {
            opacity: 0.15,
            scale: 1.2,
            transition: { duration: 0.3 }
        }
    };

    return (
        <Link href={ROUTES.DASHBOARD()} className="group relative">
            <motion.div
                className="flex items-center gap-2.5"
                whileHover="hover"
                whileTap="tap"
                variants={logoVariants}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
                <div className="relative">
                    <span className="text-2xl md:text-3xl filter drop-shadow-md">🐼</span>
                    <motion.div
                        className={`absolute -inset-2 rounded-full ${isDark ? 'bg-emerald-500' : 'bg-emerald-300'}`}
                        variants={highlightVariants}
                        initial="initial"
                        animate="initial"
                        whileHover="hover"
                    />
                </div>
                <h1 className={`text-lg md:text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <span className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>Word</span>
                    <span>Panda</span>
                </h1>
            </motion.div>
        </Link>
    );
};

export default memo(NavbarBrand);
