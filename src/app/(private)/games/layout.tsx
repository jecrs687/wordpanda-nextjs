import styles from './layout.module.scss';

export default function RootLayout({
    children }: {
        children: React.ReactNode
    }) {

    return (
        <div className={styles.container}>
            <main className={styles.content}>
                {children}
            </main>
        </div >
    )
}
