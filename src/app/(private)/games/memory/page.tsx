'use client';
import BackButton from '@common/BackButton';
import MemoryGame from '@common/Games/memory/page';
import useWords from '@hooks/useWords';
import styles from './page.module.scss';
export default function Page() {

    const { words, language } = useWords();

    return (
        <main className={styles.main}>
            <BackButton />
            <MemoryGame
                words={words} lang={language}
            />
        </main>
    )
}
