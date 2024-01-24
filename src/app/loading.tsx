import LoaderSpinner from 'src/containers/core/LoaderSpinner'
import styles from './page.module.scss'
export default function Loading() {
  return (
    <main className={styles.main}>
      <LoaderSpinner />
    </main>
  )
}
