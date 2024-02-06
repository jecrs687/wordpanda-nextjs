
import BackButton from '@common/BackButton'
import CloseButton from '@common/CloseButton'
import styles from './layout.module.scss'


export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (<main className={styles.main}>
        <div className={styles.buttons}>
            <BackButton>
                {""}
            </BackButton>
            <CloseButton />
        </div>
        {children}
    </main>
    )
}
