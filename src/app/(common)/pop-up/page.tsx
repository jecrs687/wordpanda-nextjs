"use client";
import { ROUTES } from '@constants/ROUTES';
import { useChannels } from '@hooks/useChannels';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loading from 'src/app/loading';
import LoginPage from '../extension/(auth)/login/_container/Login';

export default function Page() {

  const { popUp } = useChannels();
  const route = useRouter()
  const [show, setShow] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      const token = localStorage.getItem('wordPand_token')
      if (token) {
        popUp.setToken(token)
      } else {
        setShow(true)
      }
      route.push(ROUTES.POP_DASHBOARD())
    }, 500)
  }, [route, popUp])
  if (typeof window === 'undefined') return <></>
  if (!show) return <Loading />
  return <LoginPage nextPage={
    ROUTES.POP_DASHBOARD()
  } />
}
