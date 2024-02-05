'use client';
import FlashCardGame from '@common/Games/flashcard/page';
import useEvents from '@hooks/useEvents';
import { IEventPrime } from '@view/interfaces/IEvents';
import styles from './page.module.scss';
export default function Page() {
    const { events: { words } } = useEvents();
    const translated = Object.values(words)[0] as IEventPrime
    return (

        <main className={styles.main}>
            <FlashCardGame
                words={translated}
            />
        </main>
    )
}
