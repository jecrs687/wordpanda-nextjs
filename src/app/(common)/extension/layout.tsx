
import CloseButton from '@common/CloseButton'
import LogoutButton from '@common/LogoutButton'
import SubtitleProvider from '@providers/SubtitleProvider'
import styles from './layout.module.scss'


export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (<main className={styles.main}>
        <SubtitleProvider />
        <div className={styles.header}>
            <CloseButton />
            <LogoutButton />
        </div>
        {children}
    </main>
    )
}
