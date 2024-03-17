import BackButton from '@common/BackButton';
import styles from './layout.module.scss';

export default function RootLayout({
    children }: {
        children: React.ReactNode
    }) {

    return (
        <div className={styles.container}>
            <div className={styles.backButton}>
                <BackButton />
            </div>

            <main className={styles.content}>
                {children}
            </main>
        </div >
    )
}
