'use client';
import DefinitionMatchGame from '@common/Games/definitionmatch/page';
import useWords from '@hooks/useWords';

export const maxDuration = 60;

export default function Page() {
    const { words, language, mediaId } = useWords();

    return (
        <DefinitionMatchGame words={words} lang={language} mediaId={mediaId} />
    );
}
