"use client";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { usePathname, useRouter } from 'next/navigation';
import styles from './BackButton.module.scss';
export default function BackButton({
    children,
    title,
    routesToExclude = []
}: {
    title?: string,
    children?: React.ReactNode,
    routesToExclude?: string[]
}) {
    const router = useRouter()
    const path = usePathname()
    if (routesToExclude.includes(path)) return null
    return (

        <div className={styles.title__box}>
            <button type="button" onClick={() => router.back()}
                className={styles.title__back}
            >
                <ArrowBackIcon />
            </button>
            <h1 className={styles.title__text}>
                {title}
            </h1>
            {children}
        </div>

    )
}