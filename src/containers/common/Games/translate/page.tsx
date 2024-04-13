'use client';
import { Body } from './_container/Body';
export default function TranslateGame({ words, lang, mediaId }: { words: { word: string }[], lang: string, mediaId?: number }) {
    if (!words.length && !lang) return null;

    return (
        <Body words={words} lang={lang} mediaId={mediaId} />
    )
}
