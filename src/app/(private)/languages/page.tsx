import { getLanguages } from '@backend/domain/actions/Languages/getLanguages.action';
import { getUserLanguages } from '@backend/domain/actions/Languages/getUserLanguages.action';
import styles from './page.module.scss';

export const dynamic = 'force-dynamic'
export default async function Page() {
    const { languages } = await getLanguages()
    const { userLanguages } = await getUserLanguages()
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.card}>
                    <h3>Languages</h3>
                    <div className={styles.languages}>
                        {
                            languages.map((lang, index) => {
                                return (
                                    <div className={styles.language} key={index}>
                                        <h3>{lang.language}</h3>
                                        <p>{lang.code}</p>
                                    </div>
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
                                    <div className={styles.language} key={index}>
                                        <h3>{lang.language.language}</h3>
                                        <p>{lang.language.code}</p>
                                        <p>
                                            Words
                                        </p>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

        </main >
    )
}
