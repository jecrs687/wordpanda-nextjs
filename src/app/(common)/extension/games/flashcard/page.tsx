'use client';
import BackButton from '@common/BackButton';
import FlashCardGame from '@common/Games/flashcard/page';
import useEvents from '@hooks/useEvents';
import { IEventPrime } from '@view/interfaces/IEvents';
import styles from './page.module.scss';
export default function Page() {
    const { events: { words } } = useEvents();
    if (typeof window === 'undefined') return <></>
    const translated = Object.values(words)[0] as IEventPrime
    return (

        <main className={styles.main}>
            <BackButton>
                Flashcard
            </BackButton>
            <FlashCardGame
                words={translated.words}
                lang={translated.jsonFromTTML.lang}
            />
        </main>
    )
}
