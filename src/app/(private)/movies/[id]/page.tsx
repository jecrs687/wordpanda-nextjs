import { getMovieByUser } from '@backend/domain/actions/Movie/getMovieByUser';
import BackButton from '@common/BackButton';
import { CardGame } from '@common/CardGame';
import styles from './page.module.scss';
export default async function Page({
    params: { id }
}) {
    const {
        languagesByMediaByUser, movie, user, wordsByMediaByLanguage, wordsByUserByMediaByLanguage
    } = await getMovieByUser(+id)
    return (
        <main className={styles.main}>
            <BackButton title={movie.name} />
            <h3>
                Linguas disponíveis:
            </h3>
            <div className={styles.languages}>
                {
                    movie.mediaLanguages.map((mediaLanguage, index) => {
                        return (
                            <CardGame key={index}
                                mediaId={movie.id}
                                words={mediaLanguage.mediaWords.map(({ word }) => word)}
                                language={mediaLanguage.language.code}>
                                <h3>{mediaLanguage.language.language} ({mediaLanguage.language.code})</h3>
                                <h4>
                                    {+(wordsByUserByMediaByLanguage[mediaLanguage.language.id]?.length) || 0}/{mediaLanguage.mediaWords.length}
                                </h4>
                            </CardGame>
                        )
                    })
                }
            </div>
        </main>
    )
}
