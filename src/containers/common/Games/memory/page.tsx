'use client';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Body } from './_container/Body';
export default function MemoryGame({ words, lang, mediaId }: { words: { word: string }[], lang: string, mediaId?: unknown | number }) {
    if (!words.length) return null;

    return (
        <DndProvider backend={HTML5Backend}>
            <Body words={words} lang={lang} mediaId={mediaId} />
        </DndProvider>
    )
}
