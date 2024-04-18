
"use client";
import useWords from '@hooks/useWords';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import styles from './Card.module.scss';
export const CardGame = ({ words, language, mediaId = undefined, className = "", languageName, mediaWords, totalWords }) => {
    const router = useRouter()
    const { insert } = useWords()
    return (
        <div className={clsx(styles.card, className)}
            onClick={() => {
                insert(words, language, mediaId)
                router.push('/games')
            }}
        >
            <h3>{languageName} ({language})</h3>
            <h4>
                {mediaWords.length} / {totalWords}
            </h4>
        </div>
    )
}