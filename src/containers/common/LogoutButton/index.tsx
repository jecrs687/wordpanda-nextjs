"use client";
import { ROUTES } from '@constants/ROUTES';
import { useChannels } from '@hooks/useChannels';
import useDevice from '@hooks/useDevice';
import Logout from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';
import styles from './LogoutButton.module.scss';
export default function LogoutButton() {
    const { web } = useChannels()
    const { extension } = useDevice()
    const router = useRouter()
    const extensionLogout = () => {
        web.logout()
        router.push(ROUTES.EXTENSION() + ROUTES.LOGIN())
    }
    return (
        <button type="button" onClick={() => extension ? extensionLogout() : router.push(ROUTES.LOGOUT())}
            className={styles.logoutButton}
        >
            <Logout />
        </button>
    )
}