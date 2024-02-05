"use client";
import { ROUTES } from '@constants/ROUTES';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter()
  const routes = [
    ROUTES.SAVE_WORDS()
  ]
  return (
    <main>
      <h1>Admin Page</h1>
      {routes.map(
        (item, index) => <button key={index} onClick={() => {
          router.push(item)
        }}>
          {item}
        </button>
      )}
    </main>
  )
}
