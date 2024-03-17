import { StoreLanguage } from '@common/StoreLanguage';
import { GAMES } from '@constants/GAMES';
import { Svg } from '@core/Svg';
import Link from 'next/link';
import styles from './page.module.scss';

export default async function GamesPage(
    {
        language
    }: { language?: any }
) {
    const allowedGames = [
        'Translate',
        'Memory',
        'Flashcards'
    ]

    return (
        <main className={
            styles.main

        }>
            {
                !!language && (
                    <StoreLanguage words={language.languages.word} language={language.languages.code} />
                )

            }
            <div className={styles.title__box}>
                <h1 className={styles.title__text}>
                    Games
                </h1>
            </div>
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
                                href={url}
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
