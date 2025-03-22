"use client";

import { motion } from 'framer-motion';
import LanguageMetricCard from './LanguageMetricCard';

interface MetricProps {
    metrics: Array<{
        language: {
            language: string;
            code: string;
        };
        _count: {
            userWords: number;
        };
        metric: {
            errors: number;
            attempts: number;
            mostShowed: string;
            mostWrong: string;
        };
    }>;
}

export default function Metrics({ metrics }: MetricProps) {
    if (!metrics || metrics.length === 0) {
        return (
            <div className="w-full rounded-xl bg-white dark:bg-gray-900 shadow-sm p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                    Você ainda não tem métricas de aprendizado.
                </p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full"
        >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Métricas de Aprendizado
            </h2>

            <div className="space-y-4">
                {metrics.map((lang, index) => {
                    const listOfMetrics = [
                        {
                            name: 'Em aprendizado',
                            value: lang._count.userWords
                        },
                        {
                            name: 'Total de treinos',
                            value: lang.metric.attempts
                        },
                        {
                            name: 'Palavra mais vista',
                            value: lang.metric.mostShowed
                        },
                        {
                            name: 'Palavra mais difícil',
                            value: lang.metric.mostWrong
                        },
                        {
                            name: 'Total de erros',
                            value: lang.metric.errors
                        }
                    ];

                    return (
                        <LanguageMetricCard
                            key={index}
                            languageName={lang.language.language}
                            languageCode={lang.language.code || ''}
                            metrics={listOfMetrics}
                            index={index}
                        />
                    );
                })}
            </div>
        </motion.div>
    );
}
