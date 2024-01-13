import { getUser } from '@actions/User/getUser.action';
import { cookies } from 'next/headers';
import Image from 'next/image';
import styles from './page.module.scss';
export default async function Page() {

    const { user } = await getUser(cookies().get('token').value)
    const { userLanguages, mediaUser } = user
    const mediaUserMultiple = mediaUser.map((media) => {
        return Array(20).fill(media)
    }).flat().sort(() => Math.random() - 0.5)
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.card}>
                    <h3>Learn</h3>
                    <div className={styles.languages}>
                        {
                            userLanguages.map((language, index) => {
                                return language.userWords.map((word, index) => {
                                    return (
                                        <div className={styles.language} key={index}>
                                            <h3>{language.language.language}</h3>
                                            <p>{language.language.code}</p>
                                        </div>
                                    )
                                })
                            })
                        }
                    </div>
                    <div className={styles.media}>
                        <div className={styles.watched}>
                            <h4>Watched</h4>
                            <div className={styles.contents}>
                                {mediaUserMultiple.map((content, index) => {
                                    return (
                                        <div key={index} className={styles.content}>
                                            <span className={styles.title}>

                                                {content.media.name}</span>
                                            <span
                                                className={styles.language}
                                            >{content.language.language}</span>
                                            <span
                                                className={styles.platform}
                                            >
                                                {content.media.Platform.name}
                                            </span>
                                            <Image
                                                width={50}
                                                height={50}
                                                src={content.media.logoUrl}
                                                alt={content.media.name}
                                                className={styles.logo}
                                            />
                                        </div>

                                    )
                                })}</div>
                        </div>

                    </div>
                </div>

            </div>

        </main>
    )
}
