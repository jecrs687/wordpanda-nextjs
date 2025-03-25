import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface SocialLoginButtonProps {
    icon: React.ReactNode;
    type: 'google' | 'apple' | 'facebook';
    label?: string;
    onClick?: () => void;
}

export const SocialLoginButton = ({ icon, type, label, onClick }: SocialLoginButtonProps) => {
    const { t } = useTranslation();

    return (
        <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onClick}
            className="flex items-center justify-center py-2.5 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/70 transition-colors"
            aria-label={t('auth.loginWith', { provider: type })}
        >
            <span className="flex items-center">
                {icon}
                {label && <span className="ml-2 text-zinc-700 dark:text-zinc-200 font-medium">{label}</span>}
            </span>
        </motion.button>
    );
};
