
'use client'

import { TextCard } from '@/Containers/Commons/TextCard'
import { useEvent } from '@/Containers/hooks/useEvent'
import { Words } from '@/Containers/types/word.type'
import { envs } from '@/utils/envs'
import dynamic from 'next/dynamic'

const DashboardComponent = () => {
    const {words} = useEvent<{words: Words[]} | undefined>('words') || {words: []}
  return (
    <main>
        {words?.map((word:Words, index)=> <TextCard key={index} percentage={+word.percentage.toFixed(2)} total={+word.percentage.toFixed(2)} world={word.word}/> )}
    </main>
  )
}
export const Dashboard = dynamic(() => Promise.resolve(DashboardComponent) ,{ ssr: false })