import { RingChart } from '@common/Charts/RingChart'
import { ROUTES } from '@constants/ROUTES'
import Link from 'next/link'
import { Suspense } from 'react'
import styles from './LanguageCard.module.scss'


export default function LanguageCard({
    id, language, code, wordsNumber, totalWordsNumber
}: {
    id: number,
    language: string,
    code: string,
    wordsNumber: number,
    totalWordsNumber: number
}) {
    return (
        <Link
            href={ROUTES.LANGUAGE(id)}
            className={styles.card}
        >
            <div className={styles.card__content}>
                <div className={styles.card__info}>
                    <h3
                        className={styles.card__title}
                    >{language}</h3>
                    <p
                        className={styles.card__code}
                    >{code}</p>
                    <p
                        className={styles.card__words}
                    >palavras: {wordsNumber} / {totalWordsNumber}</p>
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                    <RingChart percent={
                        wordsNumber / totalWordsNumber
                    } size={80} />
                </Suspense>

            </div>
        </Link>
    )
}