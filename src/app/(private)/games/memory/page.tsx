'use client';
import MemoryGame from '@common/Games/memory/page';
import useWords from '@hooks/useWords';

export const maxDuration = 60;

export default function Page() {

    const { words, language, mediaId } = useWords();

    return (
        <MemoryGame
            lang={language} mediaId={mediaId}
        />

    )
}
