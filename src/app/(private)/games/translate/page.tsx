'use client';
import TranslateGame from '@common/Games/translate/page';
import useWords from '@hooks/useWords';
export const maxDuration = 60;

export default function Page() {
    const { words, language, mediaId } = useWords();

    return (
        <TranslateGame
            words={words} lang={language} mediaId={mediaId}
        />
    )
}
