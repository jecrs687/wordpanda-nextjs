'use client';
import TranslateGame from '@common/Games/translate/page';
import useWords from '@hooks/useWords';
export default function Page() {
    const { words, language } = useWords();

    return (
        <TranslateGame
            words={words} lang={language}
        />
    )
}
