"use client";
import { getUser, getUserInformation } from '@actions/User/getUser.action';
import { getPlatforms } from '@backend/domain/actions/Platform/getPlatform.action';
import CardMovieBig from '@common/Cards/CardMovieBig';
import CardMovieSmall from '@common/Cards/CardMovieSmall';
import LanguageCard from '@common/Cards/LanguageCard';
import Input from '@common/Input';
import { ShowIf } from '@common/ShowIf/ShowIf';
import Button from '@core/Button';
import LoaderSpinner from '@core/LoaderSpinner';
import useSearch from '@hooks/useSearch';
import { getCategoryBadge, getCategoryEmoji } from '@utils/categoryUtils';
import { deepcopy } from '@utils/deepcopy';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { insertMissingMovies } from './action';

type Platform = Awaited<ReturnType<typeof getPlatforms>>['platforms']
const Dashboard = ({
    languages: langProp,
    medias: mediasProp,
    platforms: platProp,
}: {
    languages: Awaited<ReturnType<typeof getUser>>['user']['userLanguages'],
    medias: Awaited<ReturnType<typeof getUser>>['user']['mediaUser'],
    platforms: Platform,
}) => {
    const { t } = useTranslation();
    const { search, setSearch } = useSearch();
    const [languages, setLanguages] = useState(langProp);
    const [medias, setMedias] = useState(mediasProp);
    const [plat, setPlat] = useState<Platform>(platProp);
    const [loading, setLoading] = useState(false);
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark';

    const updateValues = useCallback(async () => {
        const [{ user }, { platforms }] = await Promise.all([getUserInformation(), getPlatforms({
            search
        })])
        const { userLanguages: languages, mediaUser: medias } = user
        return { languages, medias, platforms }
    }, [search])

    useEffect(() => {
        let debounce = setTimeout(async () => {
            setLoading(true)
            const { languages, medias, platforms } = await updateValues()
            if (debounce === null) return
            setLanguages(languages)
            setMedias(medias)
            setPlat(platforms)
            setLoading(false)
        }, 700)
        return () => {
            clearTimeout(debounce)
            debounce = null
        }
    }, [search, updateValues])

    const userLanguages = languages.filter(({ language }) => language.language.toLowerCase().includes(search.toLowerCase()))
    const mediaUser = medias.filter(({ mediaLanguage }) => mediaLanguage.media.name.toLowerCase().includes(search.toLowerCase()))
    const platforms = plat.map((platform) => ({ ...platform, medias: platform?.medias })
    ).filter(({ medias }) => medias.length)
    const mostViewed = deepcopy<typeof platforms>(platforms)?.[0]?.medias?.sort((a, b) => b.mediaLanguages.reduce((a, c) => a + c._count.mediaUsers, 0) - a.mediaLanguages.reduce((a, c) => a + c._count.mediaUsers, 0)).slice(0, 25) || []
    const recentAdded = deepcopy<typeof platforms>(platforms)?.[0]?.medias?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 25) || [];
    const notFound = !mostViewed.length && !recentAdded.length
    const orderByCategory = platforms
        .flatMap(x => x.medias)
        .map(x => ({ ...x, platform: platforms[0].name }))
        .reduce(
            (acc: { [key: string]: typeof platforms[0]['medias'] }, x) => {
                x.mediaLanguages?.forEach(y => {
                    y.categories.forEach(z => {
                        acc[z] = acc[z] || []
                        acc[z].push(x)
                        acc[z].sort(
                            (a, b) =>
                                b.mediaLanguages.reduce((a, c) => a + c._count.mediaUsers, 0)
                                -
                                a.mediaLanguages.reduce((a, c) => a + c._count.mediaUsers, 0)
                        )
                    })
                })
                return acc
            }, {}
        )

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <main className={`min-h-screen w-full pb-12 overflow-x-hidden
            ${isDark
                ? 'bg-gradient-to-br from-gray-950 via-gray-950/95 to-gray-900 text-white'
                : 'bg-gradient-to-br from-white via-sky-50/30 to-zinc-100'}`}
        >


            {/* Main content with enhanced background and UI */}
            <div className="container mx-auto px-4 pt-8 relative">
                {/* Background decorations */}
                {!loading && !search && (
                    <>
                        <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl -z-10 animate-pulse" />
                        <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '8s' }} />
                        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '12s' }} />
                    </>
                )}

                {loading && (
                    <div className="flex flex-col justify-center items-center w-full py-32">
                        <LoaderSpinner size="large" />
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className={`mt-6 text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                        >
                            {t('dashboard.searchingContent')}
                        </motion.p>
                    </div>
                )}

                <AnimatePresence>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="space-y-12"
                    >
                        {/* Not found content with improved UI */}
                        <ShowIf condition={!loading && notFound}>
                            <motion.div
                                variants={itemVariants}
                                className={`relative overflow-hidden rounded-2xl p-8 border shadow-xl
                                    ${isDark
                                        ? 'bg-gray-900/70 backdrop-blur-xl border-gray-800/50'
                                        : 'bg-white/80 backdrop-blur-lg border-zinc-200/50'}`}
                            >
                                <form
                                    onSubmit={(event) => {
                                        insertMissingMovies(new FormData(event.currentTarget))
                                    }}
                                    className="space-y-8 max-w-2xl mx-auto relative z-10"
                                >
                                    {/* Decorative elements */}
                                    <div className="absolute -top-20 -right-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-3xl -z-0" />
                                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-400/20 rounded-full blur-3xl -z-0" />

                                    <div className="text-center space-y-4 relative">
                                        <span className="inline-block text-5xl mb-2">🧐</span>
                                        <h2 className={`text-3xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {t('dashboard.noResults.title')}
                                        </h2>
                                        <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {t('dashboard.noResults.addToDatabase')}
                                            <br />
                                            {t('dashboard.noResults.fillForm')}
                                        </p>
                                    </div>

                                    <div className="space-y-5">
                                        <Input
                                            name='name'
                                            title={t('dashboard.noResults.nameField')}
                                            placeholder={t('dashboard.noResults.moviePlaceholder')}
                                        />
                                        <Input
                                            name='provider'
                                            title={t('dashboard.noResults.providerField')}
                                            placeholder={t('dashboard.noResults.providerPlaceholder')}
                                        />
                                    </div>

                                    <div className="pt-4">
                                        <Button
                                            type='submit'
                                            className={`w-full font-medium py-3.5 rounded-xl shadow-lg
                                                ${isDark
                                                    ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white hover:shadow-cyan-500/20'
                                                    : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white hover:shadow-cyan-500/30'}`}
                                            leftIcon={
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            }
                                        >
                                            {t('dashboard.noResults.addButton')}
                                        </Button>
                                    </div>

                                    <p className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {t('dashboard.noResults.approvalMessage')}
                                    </p>
                                </form>
                            </motion.div>
                        </ShowIf>

                        {/* User Languages Section with enhanced styling */}
                        <ShowIf condition={!!userLanguages.length}>
                            <motion.div variants={itemVariants} className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">🗣️</span>
                                        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {t('dashboard.sections.learning')}
                                        </h2>
                                    </div>

                                </div>

                                <motion.div
                                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        show: {
                                            opacity: 1,
                                            transition: {
                                                staggerChildren: 0.1
                                            }
                                        }
                                    }}
                                >
                                    {userLanguages.map((language, index) => (
                                        <motion.div
                                            key={index}
                                            variants={{
                                                hidden: { opacity: 0, scale: 0.9, y: 20 },
                                                show: {
                                                    opacity: 1,
                                                    scale: 1,
                                                    y: 0,
                                                    transition: { type: "spring", stiffness: 100 }
                                                }
                                            }}
                                        >
                                            <LanguageCard
                                                language={language.language.language}
                                                code={language.language.code}
                                                id={language.language.id.toString()}
                                                wordsNumber={language._count.userWords}
                                                totalWordsNumber={language.language._count.words}
                                            />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </motion.div>
                        </ShowIf>

                        {/* Media User Has Watched with enhanced styling */}
                        <ShowIf condition={!!mediaUser.length}>
                            <motion.div variants={itemVariants} className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">📺</span>
                                        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {t('dashboard.sections.watched')}
                                        </h2>
                                    </div>

                                </div>

                                <div className="relative">
                                    <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500/30 dark:scrollbar-thumb-gray-700/50 snap-x">
                                        {mediaUser.map((content, index) => (
                                            <motion.div
                                                key={index}
                                                className="snap-start flex-shrink-0 w-64"
                                                initial={{ opacity: 0, x: 50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
                                            >
                                                <CardMovieSmall
                                                    code={content.mediaLanguage.language.code}
                                                    id={content.mediaLanguage.media.id}
                                                    language={content.mediaLanguage.language.language}
                                                    logoUrl={content.mediaLanguage.media.logoUrl}
                                                    name={content.mediaLanguage.media.name}
                                                    platform={content.mediaLanguage.media.platform.name}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Gradient overlay for scrollable content */}
                                    <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-white dark:from-gray-950 to-transparent pointer-events-none"></div>
                                </div>
                            </motion.div>
                        </ShowIf>

                        {/* Platforms with enhanced styling */}
                        {platforms.map((platform, id) => (
                            <ShowIf key={id} condition={!!platform.medias.length}>
                                <motion.div
                                    variants={itemVariants}
                                    className={`space-y-6 rounded-2xl p-8
                                        ${isDark
                                            ? 'bg-gray-900/30'
                                            : 'bg-gray-50/50'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-2xl">🎬</span>
                                            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {platform.name}
                                            </h2>
                                        </div>

                                    </div>

                                    <div className="relative">
                                        <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500/30 dark:scrollbar-thumb-gray-700/50 snap-x">
                                            {platform.medias.map((content, index) => (
                                                <motion.div
                                                    key={index}
                                                    className="snap-start flex-shrink-0 w-64"
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
                                                >
                                                    <CardMovieSmall
                                                        languages={content.mediaLanguages.map((x) => x.language.language).join(', ')}
                                                        id={content.id}
                                                        logoUrl={content.logoUrl}
                                                        name={content.name}
                                                        platform={platform.name}
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Gradient overlay for scrollable content */}
                                        <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-white dark:from-gray-900/90 to-transparent pointer-events-none"></div>
                                    </div>
                                </motion.div>
                            </ShowIf>
                        ))}

                        {/* Most Viewed with enhanced grid styling */}
                        <ShowIf condition={!!mostViewed.length}>
                            <motion.div variants={itemVariants} className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">🔥</span>
                                        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            Mais vistos
                                        </h2>
                                    </div>

                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                    {mostViewed.slice(0, 8).map((content, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
                                        >
                                            <CardMovieBig
                                                id={content.id}
                                                logoUrl={content.logoUrl}
                                                name={content.name}
                                                languages={content.mediaLanguages.map((x) => x.language.language).join(', ')}
                                                index={index}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </ShowIf>

                        {/* Recently Added with enhanced styling */}
                        <ShowIf condition={!!recentAdded.length}>
                            <motion.div variants={itemVariants} className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">🆕</span>
                                        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            Adicionados recentemente
                                        </h2>
                                    </div>

                                </div>

                                <div className="relative">
                                    {/* New feature: Content showcase slider with indicator dots */}
                                    <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500/30 dark:scrollbar-thumb-gray-700/50 snap-x">
                                        {recentAdded.map((recent, id) => (
                                            <motion.div
                                                key={id}
                                                className="snap-start flex-shrink-0 w-64"
                                                initial={{ opacity: 0, x: 50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: id * 0.05 }}
                                                whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
                                            >
                                                <CardMovieSmall
                                                    languages={recent.mediaLanguages.map((x) => x.language.language).join(', ')}
                                                    id={recent.id}
                                                    logoUrl={recent.logoUrl}
                                                    name={recent.name}
                                                    platform={''}
                                                    badge={<span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2 py-0.5 text-xs rounded-full font-medium">Novo</span>}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Gradient overlay for scrollable content */}
                                    <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-white dark:from-gray-950 to-transparent pointer-events-none"></div>
                                </div>
                            </motion.div>
                        </ShowIf>

                        {/* Categories with enhanced styling */}
                        {Object.entries(orderByCategory).map(([category, medias]: any, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className={`space-y-6 rounded-2xl p-8 ${index % 2 === 0 ?
                                    (isDark ? 'bg-gradient-to-br from-gray-900/30 to-gray-800/20' : 'bg-gradient-to-br from-gray-50/60 to-blue-50/30') :
                                    (isDark ? 'bg-gradient-to-br from-gray-900/30 to-emerald-900/10' : 'bg-gradient-to-br from-gray-50/60 to-emerald-50/30')
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">{getCategoryEmoji(category)}</span>
                                        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {category}
                                        </h2>
                                    </div>

                                </div>

                                <div className="relative">
                                    <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500/30 dark:scrollbar-thumb-gray-700/50 snap-x">
                                        {medias.map((content, mediaIndex) => (
                                            <motion.div
                                                key={mediaIndex}
                                                className="snap-start flex-shrink-0 w-64"
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: mediaIndex * 0.05 }}
                                                whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
                                            >
                                                <CardMovieSmall
                                                    languages={content.mediaLanguages.map((x) => x.language.language).join(', ')}
                                                    id={content.id}
                                                    logoUrl={content.logoUrl}
                                                    name={content.name}
                                                    platform={content.platformId}
                                                    badge={getCategoryBadge(category, isDark)}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Gradient overlay for scrollable content */}
                                    <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-white dark:from-gray-900/90 to-transparent pointer-events-none"></div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Enhanced footer with newsletter subscription */}
                {!loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-20 space-y-8"
                    >
                        {/* Newsletter section */}
                        <div className={`relative overflow-hidden rounded-2xl p-8 
                            ${isDark ? 'bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 border border-gray-800'
                                : 'bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-100'}`}
                        >
                            <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
                                <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Novidades no WordPanda
                                </h3>
                                <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                                    Receba dicas, novos conteúdos e atualizações para melhorar seu aprendizado
                                </p>

                                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                    <input
                                        type="email"
                                        placeholder="Seu melhor e-mail"
                                        className={`flex-1 px-4 py-3 rounded-xl backdrop-blur-sm
                                            ${isDark ? 'bg-gray-900/50 border-gray-700 text-white' : 'bg-white/90 border-gray-200 text-gray-900'}
                                            border focus:outline-none focus:ring-2 focus:ring-emerald-500/40`}
                                    />
                                    <Button
                                        className={`px-6 ${isDark ? 'bg-gradient-to-r from-emerald-600 to-cyan-600'
                                            : 'bg-gradient-to-r from-emerald-500 to-cyan-500'} text-white font-medium`}
                                    >
                                        Inscrever-me
                                    </Button>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -top-20 -right-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-cyan-400/10 rounded-full blur-3xl"></div>
                        </div>

                        {/* Footer links and copyright */}
                        <div className={`py-8 text-center opacity-80 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                            <div className="flex justify-center gap-6 mb-4">
                                <a href="#" className={isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>Sobre nós</a>
                                <a href="#" className={isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>FAQ</a>
                                <a href="#" className={isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>Contato</a>
                            </div>
                            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                WordPanda — Seu assistente para aprendizado de idiomas © {new Date().getFullYear()}
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>
        </main>
    )
}




export default Dashboard;