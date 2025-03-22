import { motion } from 'framer-motion';
import Link from 'next/link';

type ActionButtonsProps = {
    languageName: string;
    language: string;
    isDisabled: boolean;
    isDark: boolean;
};

export const ActionButtons = ({
    languageName,
    language,
    isDisabled,
    isDark
}: ActionButtonsProps) => {
    return (
        <div className="space-y-3">
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                    w-full py-3 rounded-xl font-semibold text-sm
                    ${isDark
                        ? 'bg-emerald-700 hover:bg-emerald-600 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }
                    shadow-md ${isDark
                        ? 'shadow-emerald-900/20'
                        : 'shadow-emerald-500/20'
                    }
                    transition-all duration-300 ease-out
                    flex items-center justify-center
                    disabled:opacity-60 disabled:pointer-events-none
                `}
                disabled={isDisabled}
            >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 3v18l14-9L5 3z" fill="currentColor" />
                </svg>
                Estudar {languageName}
            </motion.button>

            <Link
                href={`/languages/${language}`}
                className={`
                    w-full py-2.5 rounded-xl font-medium text-sm
                    flex items-center justify-center
                    ${isDark
                        ? 'text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-700'
                        : 'text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200'
                    }
                    transition-colors duration-300
                `}
            >
                Ver detalhes
                <svg className="w-3.5 h-3.5 ml-1.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
            </Link>
        </div>
    );
};
