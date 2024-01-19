import { faker } from '@faker-js/faker';
import Image from 'next/image';
import Link from 'next/link';
import { GAMES } from './_constants/GAMES';
import styles from './page.module.scss';

export default async function Page() {

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
                    GAMES.map((
                        {
                            title,
                            description,
                            image,
                            url
                        }, index) => (

                        <Link
                            href={url}
                            key={index}
                            className={styles.game}

                        >
                            <Image
                                src={faker.image.url()}
                                alt={title}
                                width={200}
                                height={200}
                                className={styles.game__image}
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
