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
    const token = cookies().get('token')
    if (!token) {
        redirect(ROUTES.LOGIN())
        return <></>
    }

    return (
        <div className={styles.container}>
            <SwrCacheProvider />
            <NavBar />
            <main id="content" className={styles.content}>
                {children}
            </main>
        </div >
    )
}
