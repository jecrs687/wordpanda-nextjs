'use client';
import { IEventPrime } from '@view/interfaces/IEvents';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Body } from './_container/Body';
export default function MemoryGame({ words }: { words: IEventPrime }) {
    return (
        <DndProvider backend={HTML5Backend}>
            <Body words={words} />
        </DndProvider>
    )
}
