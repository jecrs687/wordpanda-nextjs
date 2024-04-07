import { getLanguages } from '@backend/domain/actions/Languages/getLanguages.action';
import { getUserLanguages } from '@backend/domain/actions/Languages/getUserLanguages.action';
import LanguageCard from '@common/Cards/LanguageCard';
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
                                x => x._count.words > 4
                            ).map((lang, index) => {
                                return (
                                    <LanguageCard
                                        id={lang.id}
                                        language={lang.language}
                                        code={lang.code}
                                        wordsNumber={userLanguages.find(x => x.language.id === lang.id)?._count.userWords || 0}
                                        totalWordsNumber={lang._count.words}
                                        totalOfMedias={lang._count.MediaLanguages}
                                        totalOfLearnings={lang._count.userLanguage}
                                        totalOfSpeaks={lang._count.User}
                                        key={index}
                                    />
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
                                    <LanguageCard
                                        code={lang.language.code}
                                        id={lang.language.id}
                                        key={index}
                                        language={lang.language.language}
                                        totalWordsNumber={lang.language._count.words}
                                        wordsNumber={lang._count.userWords}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
            </div>

        </main >
    )
}
