"use client";
import { useChannels } from '@hooks/useChannels';

export default function Page() {

  const { popUp } = useChannels();

  if (typeof window === 'undefined') return <></>

  return <div>
    <button onClick={() => {
      popUp.setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzEsImVtYWlsIjoiZGVtb0BkZW1vLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzA3MTc5Njg1LCJleHAiOjE3MDc3ODQ0ODV9.f-lH_-PWn6ckoNx4PtQwN1Fudg1ucYSFAO9TGb2WnB4')
    }}>
      setToken
    </button></div>
}
