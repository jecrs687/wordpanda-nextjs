
"use client";
import useWords from '@hooks/useWords';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import styles from './Card.module.scss';
export const CardGame = ({ children, words, language, mediaId = undefined, className = "" }) => {
    const router = useRouter()
    const { insert } = useWords()
    return (
        <div className={clsx(styles.card, className)}
            onClick={() => {
                insert(words, language, mediaId)
                router.push('/games')
            }}
        >
            {children}
        </div>
    )
}