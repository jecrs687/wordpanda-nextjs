import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";

type LanguageActivityProps = {
    language: string;
    flagCode: string;
    wordsLearned: number;
    accuracy: number;
    streak: number;
    lastActivity: string;
    level: string;
};

export default function LanguageActivityCard({
    language,
    flagCode,
    wordsLearned,
    accuracy,
    streak,
    lastActivity,
    level
}: LanguageActivityProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Calculate progress percentage based on level
    const levels = { "Beginner": 1, "Elementary": 2, "Intermediate": 3, "Advanced": 4, "Fluent": 5 };
    const currentLevel = levels[level] || 1;
    const progressPercent = (currentLevel / 5) * 100;

    return (
        <motion.div
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-md dark:shadow-gray-900/30 p-5 border border-gray-200/50 dark:border-gray-700/50"
        >
            <div className="flex items-center mb-4">
                <div className="relative h-8 w-12 mr-3 overflow-hidden rounded-md shadow-sm">
                    <Image
                        src={`/assets/flags/${flagCode.toLowerCase()}.svg`}
                        alt={`${language} flag`}
                        fill
                        className="object-cover"
                    />
                </div>
                <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{language}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Última atividade: {lastActivity}</p>
                </div>
            </div>

            {/* Language Level Progress */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Nível: {level}</span>
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{progressPercent}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Palavras</p>
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">{wordsLearned}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Precisão</p>
                    <p className="font-semibold text-indigo-600 dark:text-indigo-400">{accuracy}%</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Sequência</p>
                    <p className="font-semibold text-amber-600 dark:text-amber-400">{streak} dias</p>
                </div>
            </div>

            <button className="mt-4 w-full py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-800/20 transition-colors">
                Praticar agora
            </button>
        </motion.div>
    );
}
