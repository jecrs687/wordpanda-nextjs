import { RingChart } from '@common/Charts/RingChart'
import { ROUTES } from '@constants/ROUTES'
import clsx from 'clsx'
import Link from 'next/link'
import styles from './LanguageCard.module.scss'


export default function LanguageCard({
    id, language, code, wordsNumber, totalWordsNumber, totalOfMedias, totalOfLearnings, totalOfSpeaks
}: {
    id: number,
    language: string,
    code: string,
    wordsNumber: number,
    totalWordsNumber: number,
    totalOfMedias?: number,
    totalOfLearnings?: number,
    totalOfSpeaks?: number
}) {
    return (
        <Link
            href={ROUTES.LANGUAGE(id)}
            className={clsx(styles.card, {
                [styles.details]: !!totalOfMedias
            })}
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
                <div className={styles.card__stats}>
                    <p
                        className={styles.card__stat}
                    >filmes: {totalOfMedias}</p>
                    <p
                        className={styles.card__stat}
                    >aprendendo: {totalOfLearnings}</p>
                    <p
                        className={styles.card__stat}
                    >falantes: {totalOfSpeaks}</p>
                </div>
                <div className={styles.card__chart}
                >
                    <div>
                        <RingChart percent={
                            (wordsNumber || 1) / totalWordsNumber
                        } size={80} />
                    </div>
                </div>

            </div>
        </Link>
    )
}