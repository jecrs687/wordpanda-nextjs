
"use client";
import useWords from '@hooks/useWords';
import { useEffect } from 'react';
export const StoreLanguage = ({ words, language, mediaId = undefined }) => {
    const { insert } = useWords()

    useEffect(() => {
        insert(words, language, mediaId)
    }, [insert, language, mediaId, words])
    return (
        <></>
    )
}