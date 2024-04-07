import { ShowIf } from '@common/ShowIf/ShowIf'
import { ROUTES } from '@constants/ROUTES'
import Image from 'next/image'
import Link from 'next/link'
import styles from './CardMovieBig.module.scss'

export default function CardMovieBig({
    id, name, language, code, logoUrl, platform, languages, index
}: {
    id: number,
    name: string,
    language?: string,
    code?: string,
    logoUrl: string,
    platform?: string,
    languages?: string,
    index?: number

}) {

    return <Link className={styles.container} href={
        ROUTES.MOVIE(id)
    }>
        <div className={styles.content}>
            <span className={styles.title}>

                {name}</span>
            <span
                className={styles.language}
            >

                <ShowIf condition={!!language}>
                    {
                        language
                    } -
                    {
                        code
                    }
                </ShowIf>
                <ShowIf condition={!!languages}>
                    {
                        languages
                    }

                </ShowIf>
            </span>

            <ShowIf condition={index !== undefined}>
                <span className={styles.index}>
                    {index + 1}
                </span>
            </ShowIf>
            <ShowIf condition={!!platform}>
                <span
                    className={styles.platform}
                >
                    {platform}
                </span>
            </ShowIf>
        </div>
        <Image
            width={300}
            height={300}
            src={logoUrl || "https://picsum.photos/200/300"}
            alt={name}
            className={styles.logo}
        />
    </Link>
}