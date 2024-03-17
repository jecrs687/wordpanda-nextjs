"use client";
import { usePathname, useRouter } from 'next/navigation';
import styles from './BackButton.module.scss';
export default function BackButton({
    children,
    title,
}: {
    title?: string,
    children?: React.ReactNode,
}) {
    const router = useRouter()
    const path = usePathname()
    if (path === '/extension/games') return null
    return (

        <div className={styles.title__box}>
            <button type="button" onClick={() => router.back()}
                className={styles.title__back}
            >
                <span>{"<"}</span>
            </button>
            <h1 className={styles.title__text}>
                {title}
            </h1>
            {children}
        </div>

    )
}