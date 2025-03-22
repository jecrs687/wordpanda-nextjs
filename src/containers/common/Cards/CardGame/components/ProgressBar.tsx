import { motion } from 'framer-motion';

type ProgressBarProps = {
    progressPercentage: number;
    mediaWordsCount: number;
    totalWords: number;
    isDark: boolean;
};

export const ProgressBar = ({
    progressPercentage,
    mediaWordsCount,
    totalWords,
    isDark
}: ProgressBarProps) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <span className={`
                    text-sm font-medium
                    ${isDark ? 'text-gray-300' : 'text-gray-600'}
                `}>
                    Palavras aprendidas
                </span>
                <span className={`
                    text-sm font-bold
                    ${isDark ? 'text-emerald-400' : 'text-emerald-600'}
                `}>
                    {mediaWordsCount}/{totalWords}
                </span>
            </div>

            <div className={`
                w-full h-2 rounded-full overflow-hidden
                ${isDark ? 'bg-gray-800' : 'bg-gray-200'}
                border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}
            `}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{
                        duration: 1.2,
                        delay: 0.3,
                        ease: "easeOut"
                    }}
                    className={`
                        h-full 
                        ${isDark
                            ? 'bg-gradient-to-r from-emerald-700 to-emerald-500'
                            : 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                        }
                    `}
                />
            </div>

            {/* Bamboo-inspired progress markers */}
            <div className="relative flex justify-between mt-1 px-1">
                {[0, 1, 2, 3, 4].map((_, index) => (
                    <div key={index} className={`
                        w-0.5 h-1.5 rounded-full
                        ${isDark ? 'bg-gray-700' : 'bg-gray-300'}
                        ${progressPercentage >= index * 25 ?
                            (isDark ? 'bg-emerald-600' : 'bg-emerald-500') : ''}
                    `} />
                ))}
            </div>
        </div>
    );
};
