import { getLanguages } from '@backend/domain/actions/Languages/getLanguages.action';
import { getUserLanguages } from '@backend/domain/actions/Languages/getUserLanguages.action';
import { CardGame } from '@common/CardGame';
import styles from './page.module.scss';

export const dynamic = 'force-dynamic'
export default async function Page() {
    const [{ languages }, { userLanguages }] = await Promise.all([await getLanguages(), await getUserLanguages()])
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.card}>
                    <h3>Languages</h3>
                    <div className={styles.languages}>
                        {
                            languages.filter(
                                x => x.word.length > 4
                            ).map((lang, index) => {
                                return (
                                    <CardGame
                                        language={lang.code}
                                        words={lang.word}

                                        className={styles.language} key={index}>
                                        <h3>{lang.language}</h3>
                                        <p>{lang.code}</p>
                                        <p>total: {lang.word.length}</p>
                                    </CardGame>
                                )
                            })
                        }
                    </div>
                </div>
                <div className={styles.card}>
                    <h3>Languages Learning</h3>
                    <div className={styles.languages}>
                        {
                            userLanguages.map((lang, index) => {
                                return (
                                    <CardGame
                                        language={lang.language.code}
                                        words={lang.language.word}
                                        className={styles.language} key={index}>
                                        <h3>{lang.language.language}</h3>
                                        <p>{lang.language.code}</p>
                                        <p>
                                            Words: {lang.userWords.length}/{lang.language.word.length}
                                        </p>
                                    </CardGame>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

        </main >
    )
}
