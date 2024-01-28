import { Svg } from '@core/Svg';
import Link from 'next/link';
import { GAMES } from './_constants/GAMES';
import styles from './page.module.scss';

export default async function Page() {
    const allowedGames = [
        'Translate',
        'Memory',
        'Flashcards'
    ]
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
