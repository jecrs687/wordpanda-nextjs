import { getMovieByUser } from '@backend/domain/actions/Movie/getMovieByUser';
import BackButton from '@common/BackButton';
import { CardGame } from '@common/Cards/CardGame';
import Image from 'next/image';
import styles from './page.module.scss';
export default async function Page({
    params: { id }
}) {
    const {
        movie, user
    } = await getMovieByUser(+id)
    return (
        <main className={styles.main}>

            <BackButton title={movie.name} />
            <div className={styles.container}>
                <Image
                    src={movie.logoUrl}
                    alt={movie.name}
                    className={styles.logo}
                    width={400}
                    height={300}
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
                                    language={mediaLanguage.language.code}>
                                    <h3>{mediaLanguage.language.language} ({mediaLanguage.language.code})</h3>
                                    <h4>
                                        {mediaLanguage.mediaWords.length} / {mediaLanguage._count.mediaWords}
                                    </h4>
                                </CardGame>
                            )
                        })
                    }
                </div>
            </div>
        </main>
    )
}
