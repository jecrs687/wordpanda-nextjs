import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface PreferenceSectionProps {
    title: string;
    description: string;
    children: ReactNode;
    error?: string;
}

export const PreferenceSection = ({ title, description, children, error }: PreferenceSectionProps) => {
    const { t } = useTranslation();

    // Animation for section transitions
    const sectionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <motion.section
            variants={sectionVariants}
            className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-4 md:p-6"
        >
            <h3 className="text-xl font-bold mb-2 text-zinc-800 dark:text-white flex items-center">
                {title}
            </h3>
            <p className="mb-5 text-zinc-600 dark:text-zinc-300 text-sm md:text-base">
                {description}
            </p>

            {children}

            {error && (
                <p className="mt-3 text-rose-500 text-sm font-medium">{error}</p>
            )}
        </motion.section>
    );
};
