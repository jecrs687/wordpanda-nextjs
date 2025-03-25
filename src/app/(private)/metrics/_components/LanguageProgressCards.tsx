import { motion } from "framer-motion";

interface LanguageProgressCardsProps {
    languages: Array<{
        id: string;
        name: string;
        code: string;
        wordsCount: number;
        successRate: number;
        efficiency: number;
    }>;
}

export default function LanguageProgressCards({ languages }: LanguageProgressCardsProps) {
    if (!languages.length) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400 text-center">
                    No language data available yet.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4 overflow-auto max-h-full pr-2">
            {languages.map((lang, index) => (
                <LanguageCard key={lang.id} language={lang} index={index} />
            ))}
        </div>
    );
}

function LanguageCard({ language, index }: { language: any; index: number }) {
    const efficiencyPercentage = Math.min(Math.round(language.efficiency), 100);
    const successPercentage = Math.round(language.successRate);

    const getEfficiencyColor = (value: number) => {
        if (value >= 70) return "bg-emerald-500 dark:bg-emerald-400";
        if (value >= 40) return "bg-amber-500 dark:bg-amber-400";
        return "bg-rose-500 dark:bg-rose-400";
    };

    const getSuccessColor = (value: number) => {
        if (value >= 80) return "bg-emerald-500 dark:bg-emerald-400";
        if (value >= 60) return "bg-amber-500 dark:bg-amber-400";
        return "bg-rose-500 dark:bg-rose-400";
    };

    const efficiencyColor = getEfficiencyColor(efficiencyPercentage);
    const successColor = getSuccessColor(successPercentage);

    return (
        <motion.div
            className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center font-bold text-gray-700 dark:text-gray-200">
                        {language.code.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="ml-3">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                            {language.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {language.wordsCount} words learned
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-300">Success Rate</span>
                        <span className="font-medium text-gray-900 dark:text-white">{successPercentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full ${successColor}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${successPercentage}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                        />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-300">Learning Efficiency</span>
                        <span className="font-medium text-gray-900 dark:text-white">{efficiencyPercentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full ${efficiencyColor}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${efficiencyPercentage}%` }}
                            transition={{ duration: 1, delay: 0.4 }}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
