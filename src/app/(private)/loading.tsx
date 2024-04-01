import LoaderSpinner from '@core/LoaderSpinner'
import styles from './loading.module.scss'
export default function Loading() {
  return (
    <main className={styles.main}>
      <LoaderSpinner />
    </main>
  )
}
