
"use client";
import { TextCard } from '@common/TextCard'
import { useEvent } from '@hooks/useEvent'
import { IWord } from '@view/interfaces/IWord'
import { envs } from '@utils/envs'
import dynamic from 'next/dynamic'
import styles from './dashboard.module.scss'
import { useEffect, useState } from 'react'
import { useApi } from '@hooks/useApi'
import { randomUUID } from 'crypto'
import { wordsMock } from '@mocks/wordsMock';
const DashboardComponent = () => {

  const { words, jsonFromTTML } = useEvent<{ words: IWord[], jsonFromTTML: any } | undefined>('words') || { words: [] }
  const [translations, setTranslations] = useState();
  const { response, loading, refetch } = useApi({
    method: 'POST',
    body: { words, jsonFromTTML },
    url: '/translate',
    initialFetch: true
  })
  useEffect(() => {
    if (!words.length)
      parent.postMessage({ name: 'sendWords' })
  }, [words.length])
  return (
    <main className={styles.container}>
      <h1>Dashboard</h1>
      <button
        onClick={() => {
          parent.postMessage({ name: 'closeModal' }, '*')
        }}
      >Close Modal 2</button>
      <button
        onClick={() => {
          parent.postMessage({ name: 'openModal' }, '*')
          window.parent.postMessage({ name: 'sendWords' }, '*')
          parent.parent.postMessage({ name: 'sendWords' }, '*')

        }}
      >Open Modal 2</button>
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