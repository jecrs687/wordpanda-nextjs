"use client";;
import BackButton from '@common/BackButton';
import { CardGame } from '@common/Cards/CardGame';
import { fetchClient } from '@services/fetchClient';
import Image from 'next/image';
import { use } from "react";
import { MovieIdGetResponse } from 'src/app/api/movie/[id]/route';
import useSWR from 'swr';
import styles from './page.module.scss';
export default async function Page(props) {
    const params: {
        id: string;
    } = use(props.params);

    const {
        id
    } = params;

    const {
        data: { data: { movie, user } }
    } = useSWR<MovieIdGetResponse, Error>('/api/movie/' + id, {
        fetcher: fetchClient("GET")
    });
    return (
        <main className={styles.main}>
            <div className={styles.header}>
                <BackButton title={movie.name} />

            </div>
            <div className={styles.container}>
                <Image
                    src={movie.logoUrl}
                    alt={movie.name}
                    className={styles.logo}
                    width={400}
                    height={400}
                />
                <h3>
                    Linguas disponíveis:
                </h3>
                <div className={styles.languages}>
                    {
                        movie.mediaLanguages.map((mediaLanguage, index) => {
                            return (
                                <CardGame key={index}
                                    mediaId={movie.id}
                                    words={[]}
                                    language={mediaLanguage.language.code}
                                    languageName={mediaLanguage.language.language}
                                    mediaWords={mediaLanguage.mediaWords}
                                    totalWords={mediaLanguage._count.mediaWords}
                                />
                            )
                        })
                    }
                </div>
            </div>
        </main>
    )
}
