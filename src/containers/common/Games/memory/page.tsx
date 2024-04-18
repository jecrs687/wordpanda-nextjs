'use client';
import { Body } from './_container/Body';
export default function MemoryGame({ words, lang, mediaId }: { words: { word: string }[], lang: string, mediaId?: string }) {
    if (!words.length && !lang) return null;

    return (
        <Body words={words} lang={lang} mediaId={mediaId} />
    )
}
