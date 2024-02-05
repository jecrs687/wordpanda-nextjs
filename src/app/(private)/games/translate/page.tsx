'use client';
import TranslateGame from '@common/Games/translate/page';
import useEvents from '@hooks/useEvents';
import styles from './page.module.scss';
export default function Page() {
    const { events: { words: list } } = useEvents();
    const words = Object.values(list)[0]
    return (
        <main className={styles.main}>
            <TranslateGame words={words} />
        </main>
    )
}
