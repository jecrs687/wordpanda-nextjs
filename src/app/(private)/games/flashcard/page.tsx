'use client';
import FlashCardGame from '@common/Games/flashcard/page';
import useWords from '@hooks/useWords';
export default function Page() {

    const { words, language, media } = useWords();


    return (
        <FlashCardGame words={words} lang={language} mediaId={media} />
    )
}
