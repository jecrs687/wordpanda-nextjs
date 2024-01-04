import { Dashboard } from './_container/Dashboard';
import styles from './page.module.scss';

export default async function Page() {

    return (
        <main className={styles.main}>
            <h1>Language Learning Application</h1>
            <p>Our application is designed to help you
                learn new languages using subtitles. With our app, you can watch
                your favorite movies and TV shows with subtitles in your target
                language, making it easier to learn new words and phrases.</p>
            <Dashboard />
        </main>
    )
}
