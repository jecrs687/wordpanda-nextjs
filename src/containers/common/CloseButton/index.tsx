"use client";
import { useChannels } from '@hooks/useChannels';
import CloseRounded from '@mui/icons-material/CloseRounded';
import styles from './CloseButton.module.scss';
export default function CloseButton() {
    const { web } = useChannels()
    return (
        <button type="button" onClick={() => web.closeModal()}
            className={styles.closeButton}
        >
            <CloseRounded />
        </button>
    )
}