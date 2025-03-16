"use client";
import { getLanguages } from '@backend/domain/actions/Languages/getLanguages.action';
import { getUserLanguages } from '@backend/domain/actions/Languages/getUserLanguages.action';
import LanguageCard from '@common/Cards/LanguageCard';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Page() {
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

    if (!languages.length || !userLanguages.length) return null;

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
        <main className="min-h-screen w-full py-8 px-4 md:px-8 bg-gradient-to-br from-white to-zinc-100 dark:from-black dark:to-gray-950 dark:bg-blend-overlay dark:bg-opacity-90">
            <div className="max-w-7xl mx-auto space-y-8">
                <motion.div
                    className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-zinc-100 dark:border-zinc-800"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="p-6">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-indigo-400 mb-6">
                            Languages
                        </h3>

                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                        >
                            {languages
                                .filter(x => x._count.words > 4)
                                .map((lang, index) => (
                                    <motion.div key={index} variants={itemVariants}>
                                        <LanguageCard
                                            id={lang.id?.toString()}
                                            language={lang.language}
                                            code={lang.code}
                                            wordsNumber={userLanguages.find(x => x.language.id === lang.id)?._count.userWords || 0}
                                            totalWordsNumber={lang._count.words}
                                        />
                                    </motion.div>
                                ))}
                        </motion.div>
                    </div>
                </motion.div>

                {/* Languages Learning Section */}
                <motion.div
                    className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-zinc-100 dark:border-zinc-800"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="p-6">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-indigo-400 mb-6">
                            Languages Learning
                        </h3>

                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                        >
                            {userLanguages.map((lang, index) => (
                                <motion.div key={index} variants={itemVariants}>
                                    <LanguageCard
                                        code={lang.language.code}
                                        id={lang.language.id?.toString()}
                                        language={lang.language.language}
                                        totalWordsNumber={lang.language._count.words}
                                        wordsNumber={lang._count.userWords}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
