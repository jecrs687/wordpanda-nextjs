"use client";
import { ROUTES } from '@constants/ROUTES';
import { useChannels } from '@hooks/useChannels';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoginPage from '../extension/(auth)/login/_container/Login';

export default function Page() {

  const { popUp } = useChannels();
  const route = useRouter()

  useEffect(() => {
    setTimeout(() => {
      const token = localStorage.getItem('wordPand_token')
      if (token) {
        popUp.setToken(token)
      }
      route.push(ROUTES.POP_DASHBOARD())
    }, 500)
  }, [route, popUp])
  if (typeof window === 'undefined') return <></>

  return <LoginPage nextPage={
    ROUTES.POP_DASHBOARD()
  } />
}
