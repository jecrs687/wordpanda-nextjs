"use client";
import { usePathname, useRouter } from 'next/navigation';
import styles from './BackButton.module.scss';
export default function BackButton({
    children
}) {
    const router = useRouter()
    const path = usePathname()
    if (path === '/extension/games') return null
    return (
        <button type="button" onClick={() => router.back()}
            className={styles.backButton}
        >
            <span>{"<"}</span>
            {children}
        </button>
    )
}