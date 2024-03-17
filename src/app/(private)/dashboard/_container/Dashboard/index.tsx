"use client";
import { getUser } from '@actions/User/getUser.action';
import { getPlatforms } from '@backend/domain/actions/Platform/getPlatform.action';
import { ShowIf } from '@common/ShowIf/ShowIf';
import TextSearch from '@common/TextSearch';
import { ROUTES } from '@constants/ROUTES';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import styles from './page.module.scss';

const Dashboard = ({
    languages,
    medias,
    platforms: plat,
}: {
    languages: Awaited<ReturnType<typeof getUser>>['user']['userLanguages'],
    medias: Awaited<ReturnType<typeof getUser>>['user']['mediaUser'],
    platforms: Awaited<ReturnType<typeof getPlatforms>>['platforms'],
}) => {
    const [search, setSearch] = useState('');
    const userLanguages = languages.filter(({ language }) => language.language.toLowerCase().includes(search.toLowerCase()))
    const mediaUser = medias.filter(({ mediaLanguage }) => mediaLanguage.media.name.toLowerCase().includes(search.toLowerCase()))
    const platforms = plat.map((platform) => {
        const medias = platform.medias.filter(({ name }) => name.toLowerCase().includes(search.toLowerCase()))
        return { ...platform, medias }
    }).filter(({ medias }) => medias.length)
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
                        <h3
                            className={styles.card__title}
                        >Aprendendo</h3>
                        <div className={styles.languages}>
                            {
                                userLanguages.map((language, index) => {
                                    return (
                                        <Link
                                            href={ROUTES.LANGUAGE(language.language.id)}
                                            className={styles.language}
                                            key={index}
                                        >
                                            <h3>{language.language.language}</h3>
                                            <p>{language.language.code}</p>
                                            <p>palavras: {language._count.userWords} / {language.language._count.words}</p>
                                        </Link>
                                    )
                                })
                            }
                        </div>
                    </ShowIf>
                    <div className={styles.media}>
                        <ShowIf condition={!!mediaUser.length}>
                            <div className={styles.carrossel}>
                                <h4>Assistidos</h4>
                                <div className={styles.contents}>
                                    {mediaUser.map((content, index) => {
                                        return (
                                            <Link key={index} className={styles.content} href={
                                                ROUTES.MOVIE(content.mediaLanguage.media.id)
                                            }>
                                                <span className={styles.title}>

                                                    {content.mediaLanguage.media.name}</span>
                                                <span
                                                    className={styles.language}
                                                >
                                                    {
                                                        content.mediaLanguage.language.language
                                                    } -
                                                    {
                                                        content.mediaLanguage.language.code
                                                    }
                                                </span>
                                                <span
                                                    className={styles.platform}
                                                >
                                                    {content.mediaLanguage.media.platform.name}
                                                </span>
                                                <Image
                                                    width={50}
                                                    height={50}
                                                    src={content.mediaLanguage.media.logoUrl || "https://picsum.photos/200/300"}
                                                    alt={content.mediaLanguage.media.name}
                                                    className={styles.logo}
                                                />
                                            </Link>

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
                                                        <Link key={index} className={styles.content} href={
                                                            ROUTES.MOVIE(content.id)
                                                        }>
                                                            <span className={styles.title}>

                                                                {content.name}</span>
                                                            <span
                                                                className={styles.language}
                                                            >{content.mediaLanguages.map((x) => x.language.language).join(', ')}</span>

                                                            <Image
                                                                width={50}
                                                                height={50}
                                                                src={content.logoUrl || "https://picsum.photos/200/300"}
                                                                alt={content.name}
                                                                className={styles.logo}
                                                            />
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </ShowIf>

                                )
                            }
                        </ShowIf>
                    </div>
                </div>

            </div>

        </main>
    )
}

export default Dashboard;