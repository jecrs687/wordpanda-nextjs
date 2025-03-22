import { motion } from 'framer-motion';

type CardHeaderProps = {
    language: string;
    languageName: string;
    isDark: boolean;
};

export const CardHeader = ({ language, languageName, isDark }: CardHeaderProps) => {
    // First letter of language name as placeholder for flag
    const letterIcon = languageName.charAt(0).toUpperCase();

    return (
        <div className="flex items-center">
            <div className={`
                rounded-xl overflow-hidden
                ${isDark ? 'bg-gray-800' : 'bg-gray-100'}
                border ${isDark ? 'border-gray-700' : 'border-gray-200'}
                shadow-sm
            `}>
                <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, repeatDelay: 5, duration: 1.5 }}
                    className={`
                        relative flex items-center justify-center
                        w-12 h-12 p-2 font-bold text-xl
                        ${isDark ? 'text-emerald-400' : 'text-emerald-600'}
                    `}
                >
                    {/* Panda-inspired language icon */}
                    <span className="relative z-10">{letterIcon}</span>

                    {/* Circle background */}
                    <span className={`
                        absolute inset-2 rounded-full
                        ${isDark ? 'bg-gray-900' : 'bg-white'}
                        border ${isDark ? 'border-gray-700' : 'border-gray-200'}
                    `}></span>

                    {/* "Panda ear" decorative elements */}
                    <span className={`
                        absolute top-0 left-0 w-3 h-3 rounded-full
                        ${isDark ? 'bg-black' : 'bg-gray-300'}
                    `}></span>
                    <span className={`
                        absolute top-0 right-0 w-3 h-3 rounded-full
                        ${isDark ? 'bg-black' : 'bg-gray-300'}
                    `}></span>
                </motion.div>
            </div>

            <div className="ml-4">
                <h3 className={`
                    font-bold text-lg sm:text-xl
                    ${isDark ? 'text-white' : 'text-gray-800'}
                `}>
                    {languageName}
                </h3>
                <p className={`
                    text-xs font-medium tracking-wide
                    ${isDark ? 'text-gray-400' : 'text-gray-500'}
                `}>
                    {language.toUpperCase()}
                </p>
            </div>
        </div>
    );
};
