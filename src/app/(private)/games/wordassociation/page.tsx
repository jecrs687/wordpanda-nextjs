'use client';
import WordAssociationGame from '@common/Games/wordassociation/page';
import useWords from '@hooks/useWords';

export const maxDuration = 60;

export default function Page() {
    const { words, language, mediaId } = useWords();

    return (
        <div className="h-full w-full flex items-center justify-center">
            <WordAssociationGame words={words} lang={language} mediaId={mediaId} />
        </div>
    );
}
