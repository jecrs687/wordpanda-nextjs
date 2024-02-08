'use client';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Body } from './_container/Body';
export default function TranslateGame({ words, lang }: { words: { word: string }[], lang: string }) {
    if (!words.length) return null;

    return (
        <DndProvider backend={HTML5Backend}>
            <Body words={words} lang={lang} />
        </DndProvider>
    )
}
