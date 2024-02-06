
import BackButton from '@common/BackButton'
import styles from './layout.module.scss'


export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (<main className={styles.main}>
        <BackButton >
            {""}
        </BackButton>
        {children}
    </main>
    )
}
