'use client';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FlashBody } from './_container/Body';
export default function FlashCardGame({
    words,
    lang
}: { words: { word: string }[], lang: string }) {
    return (
        <DndProvider backend={HTML5Backend}>
            <FlashBody words={words} lang={lang} />
        </DndProvider>
    )
}

