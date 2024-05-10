import LoaderSpinner from '@core/LoaderSpinner'
import Image from 'next/image'
import styles from './loading.module.scss'
export default function Loading() {
  return (
    <main className={styles.main}>
      <LoaderSpinner />
      <header className={styles.header}>
        <Image
          className={styles.logo}
          src="/assets/logo.png" alt="panda" width={100} height={100} />
        <h1 className={styles.title}>
          WorldPanda
        </h1>
      </header>
    </main>
  )
}
