import { redirect } from 'next/navigation';
import { ROUTES } from 'src/containers/constants/ROUTES';
import styles from './page.module.scss';

export default async function Page() {

  redirect(ROUTES.PROFILE())
  return (
    <main className={styles.main}>
      <span className={styles.loader} />
    </main>
  )
}
