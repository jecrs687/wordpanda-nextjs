'use client';
import MemoryGame from '@common/Games/memory/page';
import useWords from '@hooks/useWords';
import styles from './page.module.scss';
export default function Page() {

    const { words, language, mediaId } = useWords();
    if (typeof window === 'undefined') return <></>

    return (
        <main className={styles.main}>
            <MemoryGame
                mediaId={mediaId}
                lang={language}
            />
        </main>
    )
}
