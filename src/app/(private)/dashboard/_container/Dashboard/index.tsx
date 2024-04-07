"use client";
import { getUser } from '@actions/User/getUser.action';
import { getPlatforms } from '@backend/domain/actions/Platform/getPlatform.action';
import CardMovieBig from '@common/Cards/CardMovieBig';
import CardMovieSmall from '@common/Cards/CardMovieSmall';
import LanguageCard from '@common/Cards/LanguageCard';
import { ShowIf } from '@common/ShowIf/ShowIf';
import TextSearch from '@common/TextSearch';
import { useState } from 'react';
import styles from './page.module.scss';

type Platform = Awaited<ReturnType<typeof getPlatforms>>['platforms']
const Dashboard = ({
    languages,
    medias,
    platforms: plat,
}: {
    languages: Awaited<ReturnType<typeof getUser>>['user']['userLanguages'],
    medias: Awaited<ReturnType<typeof getUser>>['user']['mediaUser'],
    platforms: Platform,
}) => {
    const [search, setSearch] = useState('');
    const userLanguages = languages.filter(({ language }) => language.language.toLowerCase().includes(search.toLowerCase()))
    const mediaUser = medias.filter(({ mediaLanguage }) => mediaLanguage.media.name.toLowerCase().includes(search.toLowerCase()))
    const platforms = plat.map((platform) => {
        const medias = platform?.medias?.filter(({ name }) => name.toLowerCase().includes(search.toLowerCase()))
        return { ...platform, medias }
    }).filter(({ medias }) => medias.length)
    const mostViewed = platforms?.[0]?.medias?.sort((a, b) => b.mediaLanguages.length - a.mediaLanguages.length).slice(0, 25) || []

    return (
        <main className={styles.main}>

            <div className={styles.header}>
                <div className={styles.search}>
                    <TextSearch
                        name=''
                        title=''
                        placeholder='Encontre seu filme, lingua ou série'
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            <div className={styles.container}>
                <div className={styles.card}>
                    <ShowIf condition={!!userLanguages.length}>
                        <div className={styles.carrossel}>
                            <h4>Aprendendo</h4>
                            <div className={styles.contents}>
                                {
                                    userLanguages.map((language, index) => {
                                        return (
                                            <LanguageCard
                                                key={index}
                                                language={language.language.language}
                                                code={language.language.code}
                                                id={language.language.id}
                                                wordsNumber={language._count.userWords}
                                                totalWordsNumber={language.language._count.words}
                                            />
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </ShowIf>
                    <div className={styles.media}>
                        <ShowIf condition={!!mediaUser.length}>
                            <div className={styles.carrossel}>
                                <h4>Assistidos</h4>
                                <div className={styles.contents}>
                                    {mediaUser.map((content, index) => {
                                        return (

                                            <CardMovieSmall
                                                code={content.mediaLanguage.language.code}
                                                id={content.mediaLanguage.media.id}
                                                language={content.mediaLanguage.language.language}
                                                logoUrl={content.mediaLanguage.media.logoUrl}
                                                name={content.mediaLanguage.media.name}
                                                platform={content.mediaLanguage.media.platform.name}
                                                key={index}
                                            />
                                        )
                                    })}
                                </div>

                            </div>
                        </ShowIf>

                        <ShowIf condition={!!platforms.length}>
                            {
                                platforms.map(
                                    (platform, id) =>
                                        <ShowIf key={id} condition={!!platform.medias.length}>
                                            <div className={styles.carrossel}>
                                                <h4>{platform.name}</h4>
                                                <div className={styles.contents}>
                                                    {platform.medias.map((content, index) =>
                                                        <CardMovieSmall
                                                            languages={content.mediaLanguages.map((x) => x.language.language).join(', ')}
                                                            id={content.id}
                                                            logoUrl={content.logoUrl}
                                                            name={content.name}
                                                            platform={platform.name}
                                                            key={index}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </ShowIf>

                                )
                            }
                        </ShowIf>
                        <ShowIf condition={!!mostViewed.length}>
                            <div className={styles.carrossel}>
                                <h4>Mais vistos</h4>
                                <div className={styles.contents}>
                                    {mostViewed.map((content, index) =>
                                        <CardMovieBig
                                            id={content.id}
                                            logoUrl={content.logoUrl}
                                            name={content.name}
                                            languages={content.mediaLanguages.map((x) => x.language.language).join(', ')}
                                            index={index}
                                            key={index}
                                        />
                                    )}
                                </div>
                            </div>
                        </ShowIf>
                    </div>
                </div>

            </div>

        </main>
    )
}

export default Dashboard;