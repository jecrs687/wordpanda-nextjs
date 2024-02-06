"use client";
import { useChannels } from '@hooks/useChannels';
import styles from './CloseButton.module.scss';
export default function CloseButton() {
    const { web } = useChannels()
    return (
        <button type="button" onClick={() => web.closeModal()}
            className={styles.closeButton}
        >
            <span>{"x"}</span>
        </button>
    )
}