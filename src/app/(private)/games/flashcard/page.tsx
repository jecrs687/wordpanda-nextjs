'use client';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FlashBody } from './_container/Body';
import styles from './page.module.scss';
export default function Page() {

    return (
        <main className={styles.main}>
            <DndProvider backend={HTML5Backend}>
                <FlashBody />
            </DndProvider>
        </main>
    )
}
