"use client";
import { getCookie } from '@utils/cookie';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { ROUTES } from 'src/containers/constants/ROUTES';
import styles from './page.module.scss';

export default function Page() {

  useEffect(() => {
    const token = getCookie("token")
    if (token)
      redirect(ROUTES.PROFILE())
    else
      redirect(ROUTES.LOGIN())
  }, [])
  return (
    <main className={styles.main}>

    </main>
  )
}
