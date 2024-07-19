'use client';
import FlashCardGame from '@common/Games/flashcard/page';
import useWords from '@hooks/useWords';

export const maxDuration = 60;

export default function Page() {

    const { words, language, mediaId } = useWords();


    return (
        <FlashCardGame words={words} lang={language} mediaId={mediaId} />
    )
}
