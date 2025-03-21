import { NextResponse } from 'next/server'
import dictionary from '@assets/dictionary.json'
// import { insertWords } from '@infra/database'
import { cookies } from 'next/headers'
export async function GET(request: Request) {
    return new Response('Hello World!', { status: 200 })
}

export async function POST(request: Request) {
    const cookie = (await cookies()).getAll()

    const body = await request.json()
    const { words, jsonFromTTML } = body
    const dictionaryWolrds = dictionary as { [key: string]: string }
    // await insertWords(words, jsonFromTTML.lang as string)
    const response = words.map((word: { word: string }) => {
        const wordData = dictionaryWolrds[word?.word]
        if (!wordData) return { ...word, translation: 'Not found' }
        return { ...word, translation: wordData }
    })


    return NextResponse.json(response)
}