import styles from './page.module.scss'
import { Dashboard } from '@/containers/services/Dashboard';
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto';
import { headers } from 'next/headers';
async function setCookie(formData: FormData) {

  "use server";
  const cookie = cookies()
  const header = headers()
  const cookiesList = cookie.getAll()
  cookie.set('id', randomUUID(), { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) })
  cookie.set('language', formData.get("input") as string)
  const resourceId = formData.get("input") as string;
  fetch('http://localhost:3000/api/translate', {
    method: 'POST',
    body: JSON.stringify({})
  })
}
export default async function Page() {
  return (
    <main className={styles.main}>
      <h1>Language Learning Application</h1>
      <p>Our application is designed to help you
        learn new languages using subtitles. With our app, you can watch
        your favorite movies and TV shows with subtitles in your target
        language, making it easier to learn new words and phrases.</p>
      <form action={setCookie}>
        <input type="text" name="input" />
        <button type='submit'>Get Started</button>
      </form>
      <Dashboard />
    </main>
  )
}
