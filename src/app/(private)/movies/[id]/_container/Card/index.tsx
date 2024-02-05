
"use client";
import useWords from '@hooks/useWords';
import { useRouter } from 'next/navigation';
import styles from './Card.module.scss';
export const Card = ({ children, words, language, mediaId }) => {
    const router = useRouter()
    const { insert } = useWords()
    return (
        <div className={styles.card}
            onClick={() => {
                insert(words.map(({ word }) => word), language, mediaId)
                router.push('/games')
            }}
        >
            {children}
        </div>
    )
}