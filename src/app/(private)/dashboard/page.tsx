import { getUser } from '@actions/User/getUser.action';
import { cookies } from 'next/headers';
import styles from './page.module.scss';
export default async function Page() {
    const user = await getUser(cookies().get('token').value)
    return (
        <main className={styles.main}>
            <h1>Language Learning Application</h1>
            <p>Our application is designed to help you
                learn new languages using subtitles. With our app, you can watch
                your favorite movies and TV shows with subtitles in your target
                language, making it easier to learn new words and phrases.</p>


        </main>
    )
}
