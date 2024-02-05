"use client";
import { Svg } from '@core/Svg';
import { useChannels } from '@hooks/useChannels';
import Link from 'next/link';
import { useEffect } from 'react';
import { GAMES } from './_constants/GAMES';
import styles from './page.module.scss';

export default function Page() {
    const { web } = useChannels()
    const allowedGames = [
        'Translate',
        'Memory',
        'Flashcards'
    ]
    useEffect(() => {
        web.sendList()
    }, [web])

    return (
        <main className={styles.main}>
            <h1 className={styles.title}>
                Games
            </h1>

            <h2 className={styles.description}>
                Learn new words and phrases
            </h2>
            <section className={styles.games}>
                {
                    GAMES
                        .filter(({ title }) => allowedGames.includes(title))
                        .map((
                            {
                                title,
                                description,
                                image,
                                url,
                                icon
                            }, index) => (

                            <Link
                                href={"/extension" + url}
                                key={index}
                                className={styles.game}
                            >
                                <Svg
                                    svg={icon}
                                    height={50}
                                    width={50}
                                    className={styles.game__icon}
                                />

                                <div className={
                                    styles.game__content
                                }>
                                    <h3 className={styles.game__title}>
                                        {title}
                                    </h3>
                                    <p className={styles.game__description}>
                                        {description}
                                    </p>
                                </div>

                            </Link>
                        ))

                }
            </section>
        </main>
    )
}
