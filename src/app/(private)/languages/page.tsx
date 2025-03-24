"use client";
import { getLanguages } from '@backend/domain/actions/Languages/getLanguages.action';
import { getUserLanguages } from '@backend/domain/actions/Languages/getUserLanguages.action';
import LanguageCard from '@common/Cards/LanguageCard';
import LanguageSwitcher from '@common/LanguageSwitcher';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Page() {
    const { t } = useTranslation();
    const [languages, setLanguages] = useState([]);
    const [userLanguages, setUserLanguages] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const [languagesData, userLanguagesData] = await Promise.all([
                getLanguages(),
                getUserLanguages()
            ]);
            setLanguages(languagesData.languages);
            setUserLanguages(userLanguagesData.userLanguages);
        }

        fetchData();
    }, []);

    if (!languages.length || !userLanguages.length) return <div>{t('common.loading')}</div>;

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">{t('languages.title')}</h1>
                <LanguageSwitcher />
            </div>
            <p className="text-gray-600 mb-8">{t('languages.description')}</p>

            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-6">{t('languages.userLanguages')}</h2>
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    {userLanguages.map((language) => (
                        <motion.div key={language.id} variants={itemVariants}>
                            <LanguageCard
                                language={language}
                                id={language.id}
                                code={language.code}
                                wordsNumber={language.wordsNumber}
                                totalWordsNumber={language.totalWordsNumber}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-6">{t('languages.availableLanguages')}</h2>
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    {languages
                        .filter(lang => !userLanguages.some(userLang => userLang.id === lang.id))
                        .map((language) => (
                            <motion.div key={language.id} variants={itemVariants}>
                                <LanguageCard
                                    language={language}
                                    id={language.id}
                                    code={language.code}
                                    wordsNumber={language.wordsNumber}
                                    totalWordsNumber={language.totalWordsNumber}
                                />
                            </motion.div>
                        ))
                    }
                </motion.div>
            </section>
        </div>
    );
}
