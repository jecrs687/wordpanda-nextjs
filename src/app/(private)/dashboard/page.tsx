import { getUser } from '@actions/User/getUser.action';
import { getPlatforms } from '@backend/domain/actions/Platform/getPlatform.action';
import { cookies } from 'next/headers';
import Image from 'next/image';
import styles from './page.module.scss';
export default async function Page() {

    const { user } = await getUser(cookies().get('token').value)
    const { platforms } = await getPlatforms()
    const { userLanguages, mediaUser } = user
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.card}>
                    <h3>Learn</h3>
                    <div className={styles.languages}>
                        {
                            userLanguages.map((language, index) => {
                                return (
                                    <div className={styles.language} key={index}>
                                        <h3>{language.language.language}</h3>
                                        <p>{language.language.code}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className={styles.media}>
                        <div className={styles.carrossel}>
                            <h4>Watched</h4>
                            <div className={styles.contents}>
                                {mediaUser.map((content, index) => {
                                    return (
                                        <div key={index} className={styles.content}>
                                            <span className={styles.title}>

                                                {content.mediaLanguage.media.name}</span>
                                            <span
                                                className={styles.language}
                                            >{content.mediaLanguage.language.language}</span>
                                            <span
                                                className={styles.platform}
                                            >
                                                {content.mediaLanguage.media.platform.name}
                                            </span>
                                            <Image
                                                width={50}
                                                height={50}
                                                src={content.mediaLanguage.media.logoUrl}
                                                alt={content.mediaLanguage.media.name}
                                                className={styles.logo}
                                            />
                                        </div>

                                    )
                                })}
                            </div>

                        </div>
                        {
                            platforms.map(
                                (platform, id) => <div key={id} className={styles.carrossel}>
                                    <h4>{platform.name}</h4>
                                    <div className={styles.contents}>
                                        {platform.medias.map((content, index) =>
                                            <div key={index} className={styles.content}>
                                                <span className={styles.title}>

                                                    {content.name}</span>
                                                <span
                                                    className={styles.language}
                                                >{content.mediaLanguages.map((x) => x.language.language).join(', ')}</span>

                                                <Image
                                                    width={50}
                                                    height={50}
                                                    src={content.logoUrl}
                                                    alt={content.name}
                                                    className={styles.logo}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                            )
                        }
                    </div>
                </div>

            </div>

        </main>
    )
}
