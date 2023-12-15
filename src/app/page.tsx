import { redirect } from 'next/navigation';
import styles from './page.module.scss';

export default async function Page() {
  redirect('/profile')
  return (
    <main className={styles.main}>
      <span className={styles.loader} />
    </main>
  )
}
