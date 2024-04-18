import { NavBar } from '@common/NavBar';
import { ROUTES } from '@constants/ROUTES';
import { AuthenticationProvider } from '@providers/AuthenticationProvider';
import { SwrCacheProvider } from '@providers/SwrCacheProvider';
import styles from './layout.module.scss';

export default function RootLayout({
    children }: {
        children: React.ReactNode
    }) {

    return (
        <div className={styles.container}>
            <SwrCacheProvider />
            <AuthenticationProvider redirect={ROUTES.LOGIN()} />
            <NavBar />
            <main id="content" className={styles.content}>
                {children}
            </main>
        </div >
    )
}
