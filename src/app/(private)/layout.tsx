import { NavBar } from '@common/NavBar';
import { ROUTES } from '@constants/ROUTES';
import { SwrCacheProvider } from '@providers/SwrCacheProvider';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import styles from './layout.module.scss';

export default function RootLayout({
    children }: {
        children: React.ReactNode
    }) {
    if (!cookies().get('token')) {
        redirect(ROUTES.LOGIN())
        return <></>
    }

    return (
        <div className={styles.container}>
            <SwrCacheProvider />
            <NavBar />
            <main className={styles.content}>
                {children}
            </main>
        </div >
    )
}
