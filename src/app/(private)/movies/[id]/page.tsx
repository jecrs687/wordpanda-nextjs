import { getMovieByUser } from '@backend/domain/actions/Movie/getMovieByUser';
import styles from './page.module.scss';
export default async function Page({
    params: { id }
}) {
    const {
        languagesByMediaByUser, movie, user, wordsByMediaByLanguage, wordsByUserByMediaByLanguage
    } = await getMovieByUser(+id)
    return (
        <main className={styles.main}>
            {
                movie.mediaLanguages.map((mediaLanguage, index) => {
                    return (
                        <div key={index} className={styles.mediaLanguage}>
                            <h3>{mediaLanguage.language.language}</h3>
                            <h4>{wordsByUserByMediaByLanguage[mediaLanguage.language.id].length}/{mediaLanguage.mediaWords.length}
                            </h4>
                        </div>
                    )
                })
            }
        </main>
    )
}
