import prisma from "@infra/config/database"
import { IEventPrime } from "@view/interfaces/IEvents"

export async function createWordsFromEvent(event: IEventPrime) {
    const language = await prisma.language.findFirst({
        where: {
            code: event.jsonFromTTML.lang.toLocaleLowerCase()
        }
    })
    const words: {
        word: string,
        languageId: number
    }[] =
        event.words.map(word => ({
            word: word.word,
            languageId: language.id
        }))

    const wordsInserted = await prisma.word.createMany({
        data: words
    })
    const wordsOnDb = await prisma.word.findMany({
        where: {
            word: {
                in: event.words.map(word => word.word)
            },
            languageId: language.id
        }
    })
    return wordsOnDb
}