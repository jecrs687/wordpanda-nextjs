"use client";
import { TOKEN_KEY } from '@constants/CONFIGS';
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
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      popUp.setToken(token)
      route.push(ROUTES.POP_DASHBOARD())
    }
    else { setShow(true) }

  }, [route, popUp])
  if (!show) return <Loading />
  return <LoginPage nextPage={
    ROUTES.DASHBOARD()
  } />
}
