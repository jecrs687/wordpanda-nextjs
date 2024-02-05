'use client';
import MemoryGame from '@common/Games/memory/page';
import useEvents from '@hooks/useEvents';
import styles from './page.module.scss';
export default function Page() {

    const { events: { words: list } } = useEvents();
    const words = Object.values(list)[0]
    return (
        <main className={styles.main}>
            <MemoryGame
                words={words.words}
                lang={words.jsonFromTTML.lang}
            />
        </main>
    )
}
