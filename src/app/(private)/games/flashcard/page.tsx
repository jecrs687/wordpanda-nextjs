'use client';
import FlashCardGame from '@common/Games/flashcard/page';
import useWords from '@hooks/useWords';
import styles from './page.module.scss';
export default function Page() {

    const { words, language, media } = useWords();


    return (
        <main className={styles.main}>
            <FlashCardGame words={words} lang={language} mediaId={media} />
        </main>
    )
}
