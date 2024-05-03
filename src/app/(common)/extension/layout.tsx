
import CloseButton from '@common/CloseButton'
import LogoutButton from '@common/LogoutButton'
import { ROUTES } from '@constants/ROUTES'
import { AuthenticationProvider } from '@providers/AuthenticationProvider'
import SubtitleProvider from '@providers/SubtitleProvider'
import { Suspense } from 'react'
import styles from './layout.module.scss'


export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (<main className={styles.main}>
        <Suspense fallback={<div>Loading...</div>}>
            <SubtitleProvider />
            <div className={styles.header}>
                <CloseButton />
                <LogoutButton />
                <AuthenticationProvider redirect={ROUTES.EXTENSION() + ROUTES.LOGIN()} />

            </div>
        </Suspense>

        {children}
    </main>
    )
}
