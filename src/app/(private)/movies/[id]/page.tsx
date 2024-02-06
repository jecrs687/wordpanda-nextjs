import { getMovieByUser } from '@backend/domain/actions/Movie/getMovieByUser';
import BackButton from '@common/BackButton';
import { Card } from './_container/Card';
import styles from './page.module.scss';
export default async function Page({
    params: { id }
}) {
    const {
        languagesByMediaByUser, movie, user, wordsByMediaByLanguage, wordsByUserByMediaByLanguage
    } = await getMovieByUser(+id)
    return (
        <main className={styles.main}>
            <BackButton>
                Movie
            </BackButton>
            <h1>{movie.name}</h1>
            <h3>
                Linguas disponíveis:
            </h3>
            <div className={styles.languages}>
                {
                    movie.mediaLanguages.map((mediaLanguage, index) => {
                        return (
                            <Card key={index}
                                mediaId={movie.id}
                                words={mediaLanguage.mediaWords}
                                language={mediaLanguage.language.code}>
                                <h3>{mediaLanguage.language.language} ({mediaLanguage.language.code})</h3>
                                <h4>
                                    {+(wordsByUserByMediaByLanguage[mediaLanguage.language.id]?.length) || 0}/{mediaLanguage.mediaWords.length}
                                </h4>
                            </Card>
                        )
                    })
                }
            </div>
        </main>
    )
}
