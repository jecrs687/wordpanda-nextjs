"use client";

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();

    if (!metrics || metrics.length === 0) {
        return (
            <div className="w-full rounded-xl bg-white dark:bg-gray-900 shadow-sm p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                    {t('profile.noMetrics')}
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
                {t('profile.learningMetrics')}
            </h2>

            <div className="space-y-4">
                {metrics.map((lang, index) => {
                    const listOfMetrics = [
                        {
                            name: t('profile.metrics.learning'),
                            value: lang._count.userWords
                        },
                        {
                            name: t('profile.metrics.totalTraining'),
                            value: lang.metric.attempts
                        },
                        {
                            name: t('profile.metrics.mostViewed'),
                            value: lang.metric.mostShowed
                        },
                        {
                            name: t('profile.metrics.mostDifficult'),
                            value: lang.metric.mostWrong
                        },
                        {
                            name: t('profile.metrics.totalErrors'),
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
