"use client";
import { useRouter } from 'next/navigation';
import styles from './BackButton.module.scss';
export default function BackButton({
    children
}) {
    const router = useRouter()

    return (
        <button type="button" onClick={() => router.back()}
            className={styles.backButton}
        >
            <span>{"<"}</span>
            {children}
        </button>
    )
}