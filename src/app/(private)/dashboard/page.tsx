import { getUser } from '@actions/User/getUser.action';
import { cookies } from 'next/headers';
import Image from 'next/image';
import styles from './page.module.scss';
export default async function Page() {
    return <main className={styles.main}></main>

    const { user } = await getUser(cookies().get('token').value)
    const { UserWords: userWords, MediaUser: mediaUser } = user
    return (
        <main className={styles.main}>
            <h1>Language Learning Application</h1>
            <p>Our application is designed to help you
                learn new languages using subtitles. With our app, you can watch
                your favorite movies and TV shows with subtitles in your target
                language, making it easier to learn new words and phrases.</p>
            <div className={styles.container}>
                <div className={styles.card}>
                    <h3>Learn</h3>
                    <div className={styles.languages}>
                        {
                            userWords.map((word, index) => {
                                return (
                                    <div className={styles.language} key={index}>
                                        <h4>{word.Language.language}</h4>
                                        <p>{word.Language.code}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div>
                        <div className={styles.contentWatched}>
                            <h4>Watched</h4>
                            <div>{mediaUser.map((content, index) => {
                                return (
                                    <div key={index}>
                                        <p>{content.Media.name}</p>
                                        <p>{content.Language.language}</p>
                                        <p>
                                            {content.Media.Platform.name}
                                        </p>
                                        <Image
                                            width={50}
                                            height={50}
                                            src={content.Media.logoUrl}
                                            alt={content.Media.name}
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
