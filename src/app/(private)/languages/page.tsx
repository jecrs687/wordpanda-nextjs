import { getLanguages } from '@backend/domain/actions/Languages/getLanguages.action';
import { getUserLanguages } from '@backend/domain/actions/Languages/getUserLanguages.action';
import { ROUTES } from '@constants/ROUTES';
import Link from 'next/link';
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
                                x => x._count.word > 4
                            ).map((lang, index) => {
                                return (
                                    <Link
                                        href={ROUTES.LANGUAGE(lang.id)}
                                        className={styles.language} key={index}>
                                        <h3>{lang.language}</h3>
                                        <p>{lang.code}</p>
                                        <p>total: {lang._count.word}</p>
                                    </Link>
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
                                    <Link
                                        href={ROUTES.LANGUAGE(lang.id)}
                                        className={styles.language}
                                        key={index}
                                    >
                                        <h3>{lang.language.language}</h3>
                                        <p>{lang.language.code}</p>
                                        <p>
                                            Words: {lang._count.userWords}/{lang.language._count.word}
                                        </p>
                                    </Link>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

        </main >
    )
}
