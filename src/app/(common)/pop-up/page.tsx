"use client";
import { ROUTES } from '@constants/ROUTES';
import { useChannels } from '@hooks/useChannels';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {

  const { web } = useChannels();
  useEffect(() => {
    redirect(ROUTES.LOGIN())

  }, [])
  if (typeof window === 'undefined') return <></>

  return <></>
}
