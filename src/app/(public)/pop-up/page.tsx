import { redirect } from 'next/navigation'
import styles from './page.module.scss'

export default function Page() {
  redirect('/')
  return (
    <main className={styles.main}>

    </main>
  )
}
