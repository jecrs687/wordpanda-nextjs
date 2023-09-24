import Image from 'next/image'
import styles from './page.module.scss'
import { Dashboard } from '@/containers/services/Dashboard'

export default function Loading() {
  return (
    <main className={styles.main}>
        <h1>Language Learning Application</h1>
          <p>Our application is designed to help you
            learn new languages using subtitles. With our app, you can watch
            your favorite movies and TV shows with subtitles in your target
            language, making it easier to learn new words and phrases.</p>
        <button >Get Started</button>
    </main>
  )
}
