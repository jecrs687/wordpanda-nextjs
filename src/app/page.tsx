"use client";
import { TOKEN_KEY } from '@constants/CONFIGS';
import { getCookie } from '@utils/cookie';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { ROUTES } from 'src/containers/constants/ROUTES';
import styles from './page.module.scss';

export default function Page() {

  useEffect(() => {
    const token = getCookie("token") || localStorage.getItem(TOKEN_KEY)
    if (token)
      redirect(ROUTES.DASHBOARD())
    else
      redirect(ROUTES.LOGIN())
  }, [])
  return (
    <main className={styles.main}>

    </main>
  )
}
