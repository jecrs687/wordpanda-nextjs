'use client';
import MemoryGame from '@common/Games/memory/page';
import useWords from '@hooks/useWords';
export default function Page() {

    const { words, language, mediaId } = useWords();

    return (
        <MemoryGame
            words={words} lang={language} mediaId={mediaId}
        />

    )
}
