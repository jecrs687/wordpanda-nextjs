'use client';
import { Body } from './_container/Body';

export default function TranslateGame({
    words,
    lang,
    mediaId
}: {
    words: { word: string }[],
    lang: string,
    mediaId?: string
}) {
    if (!words.length && !lang) return null;

    return (
        <div className="h-full w-full">
            <Body words={words} lang={lang} mediaId={mediaId} />
        </div>
    );
}
