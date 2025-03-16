import { getMovieByUser } from '@backend/domain/actions/Movie/getMovieByUser';
import BackButton from '@common/BackButton';
import { CardGame } from '@common/Cards/CardGame';
import Image from 'next/image';
import styles from './page.module.scss';
export default async function Page(props) {
    const params = await props.params;

    const {
        id
    } = params;

    const {
        movie, user
    } = await getMovieByUser(id)
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
