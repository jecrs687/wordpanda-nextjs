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
          src="/assets/logo_white.png"
          alt="panda"
          width={150}
          height={100} />
      </header>
    </main>
  )
}
