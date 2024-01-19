
"use client";
import { TextCard } from '@common/TextCard';
import { useCookie } from '@hooks/useCookie';
import useEvent from '@hooks/useEvent';
import { eventMock } from '@mocks/databaseMock';
import { IWord } from '@view/interfaces/IWord';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import useSWRMutation from 'swr/mutation';
import styles from './dashboard.module.scss';
export const fetcher = (method, args?) => async (url, { arg }: { arg: any }) =>
  await fetch(`${url}`, {
    ...args,
    headers: {
      authorization: useCookie('token')
      , ...args?.headers
    },
    method,
    body: JSON.stringify(arg),

  }).then((res) => res.json())
const DashboardComponent = () => {

  const { words, jsonFromTTML } = useEvent<{ words: IWord[], jsonFromTTML: any } | undefined>('words') || eventMock
  const [translations, setTranslations] = useState();
  const token = useCookie('token')
  const { data, error, isMutating, reset, trigger } = useSWRMutation<any>('/translate',
    fetcher('POST')

  )

  useEffect(() => {
    if (!words.length)
      parent.postMessage({ name: 'send Words' })
    // else
    //   trigger<{
    //     args: {
    //       words: IWord[], jsonFromTTML: any
    //     }
    //   }>({ words, jsonFromTTML })
  }, [words.length])
  return (
    <main className={styles.container}>
      <h1>Dashboard</h1>
      <div className={styles.grid}>
        {words.reduce((acc: Array<IWord>, word: IWord) => {
          const last = acc[acc.length - 1]
          word.total = word.percentage + (last?.total || 0)
          return [...acc, word]
        }, [])
          .map(
            (word: IWord, index: number) =>
              <TextCard key={index} percentage={+word.percentage.toFixed(2)} total={+(word?.total || 0)?.toFixed(2)} world={word.word} />
          )}
      </div>
    </main>
  )
}

export const Dashboard = dynamic(() => Promise.resolve(DashboardComponent), { ssr: false })