'use client';
import TranslateGame from '@common/Games/translate/page';
import useWords from '@hooks/useWords';
import styles from './page.module.scss';
export default function Page() {
    const { words, language } = useWords();
    if (typeof window === 'undefined') return <></>

    return (
        <main className={styles.main}>
            <TranslateGame
                words={words}
                lang={language}
            />
        </main>
    )
}
