import { motion } from 'framer-motion';
import { useState } from 'react';

interface MemoryCardProps {
    text: string;
    isFlipped: boolean;
    isMatched: boolean;
    onClick: () => void;
    isDark: boolean;
    language: string;
    lang: string;
}

export default function MemoryCard({
    text,
    isFlipped,
    isMatched,
    onClick,
    isDark,
    language,
    lang
}: MemoryCardProps) {
    const [hover, setHover] = useState(false);

    // Different colors for original language vs translation
    const getCardColors = () => {
        if (isMatched) {
            return {
                bg: isDark
                    ? 'from-emerald-800/40 to-emerald-900/40'
                    : 'from-emerald-50 to-emerald-100',
                border: isDark
                    ? 'border-emerald-600/30'
                    : 'border-emerald-300/50',
                text: isDark
                    ? 'text-emerald-300'
                    : 'text-emerald-800'
            };
        }

        if (language === 'original') {
            return {
                bg: isDark
                    ? 'from-indigo-800/40 to-indigo-900/40'
                    : 'from-indigo-50 to-indigo-100',
                border: isDark
                    ? 'border-indigo-600/30'
                    : 'border-indigo-300/50',
                text: isDark
                    ? 'text-indigo-300'
                    : 'text-indigo-800'
            };
        } else {
            return {
                bg: isDark
                    ? 'from-cyan-800/40 to-cyan-900/40'
                    : 'from-cyan-50 to-cyan-100',
                border: isDark
                    ? 'border-cyan-600/30'
                    : 'border-cyan-300/50',
                text: isDark
                    ? 'text-cyan-300'
                    : 'text-cyan-800'
            };
        }
    };

    const { bg, border, text: textColor } = getCardColors();

    return (
        <div
            className="perspective-1000 h-32 sm:h-36 md:h-40"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
                className="relative w-full h-full preserve-3d"
                whileHover={!isFlipped ? { scale: 1.03 } : {}}
                whileTap={!isFlipped ? { scale: 0.97 } : {}}
            >
                {/* Card back */}
                <div
                    className={`absolute inset-0 backface-hidden rounded-xl cursor-pointer
            ${isDark
                            ? 'bg-gradient-to-br from-gray-800/70 to-gray-900/70 border-gray-700/50'
                            : 'bg-gradient-to-br from-white/90 to-gray-100/90 border-gray-200/60'} 
            backdrop-blur-md border shadow-lg
            flex items-center justify-center
            ${isMatched ? 'opacity-60' : ''}
            transition-all duration-300`}
                    onClick={onClick}
                >
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br 
            ${isDark ? 'from-indigo-600/60 to-cyan-600/60' : 'from-indigo-500 to-cyan-500'} 
            flex items-center justify-center
            ${hover && !isFlipped ? 'scale-110' : 'scale-100'}
            transition-transform duration-300`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                        </svg>
                    </div>
                </div>

                {/* Card front */}
                <div
                    className={`absolute inset-0 backface-hidden rounded-xl rotate-y-180
            bg-gradient-to-br ${bg} border ${border} 
            backdrop-blur-md shadow-lg
            flex items-center justify-center p-3
            ${isMatched ? 'ring-2 ring-emerald-500/50' : ''}
            transition-all duration-300`}
                >
                    <p className={`text-center font-medium text-sm md:text-base ${textColor}`}>
                        {text}
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
