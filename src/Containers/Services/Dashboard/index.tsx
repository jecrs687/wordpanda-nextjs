
'use client'

import { TextCard } from '@/containers/common/TextCard'
import { useEvent } from '@/containers/hooks/useEvent'
import { Words } from '@/containers/types/word.type'
import { envs } from '@/utils/envs'
import dynamic from 'next/dynamic'
import styles from './dashboard.module.scss'
import { useEffect, useState } from 'react'
import { useApi } from '@/containers/hooks/useApi'
const DashboardComponent = () => {
    const {words} = useEvent<{words: Words[]} | undefined>('words') || {words: []}
    const [translations, setTranslations]=useState();
    const {response, loading,refetch} = useApi({
      method: 'POST',
      body: {words},
      url: '/translate',
      initialFetch: false
    })

    useEffect(()=>{
      if(words.length) refetch()
    },[words])
  return (
    <main className={styles.container}>
        <h1>Dashboard</h1>
        <div className={styles.grid}>
        {words.reduce((acc: Words[], word: Words) => {
              const last = acc[acc.length - 1]
              word.total = word.percentage + (last?.total || 0)
              return [...acc, word]
            }, [])
            .map(
          (word:Words, index: number) => 
              <TextCard key={index} percentage={+word.percentage.toFixed(2)} total={ +(word?.total || 0)?.toFixed(2) } world={word.word}/> 
          )}
        </div>
    </main>
  )
}
export const Dashboard = dynamic(() => Promise.resolve(DashboardComponent) ,{ ssr: false })