import prisma from "@infra/config/database"
import { eventMock } from "@mocks/databaseMock"





export const migrateWords = async () => {
    const {
        words, jsonFromTTML
    } = eventMock


    const language = await prisma.language.findFirst({
        where: {
            code: jsonFromTTML?.lang?.toLocaleLowerCase()
        }
    })
    if (!language) {
        await prisma.language.create({
            data: {
                code: jsonFromTTML?.lang?.toLocaleLowerCase(),
                language: jsonFromTTML?.lang?.toLocaleLowerCase()
            }
        })
    }
    const listOfWords = await prisma.word.findMany({
        where: {
            word: {
                in: words.map(word => word.word)
            },
            language: {
                code: jsonFromTTML?.lang?.toLowerCase()
            }
        }
    })

    const wordsNotInDb = words.filter(word => !listOfWords.find(wordInDb => wordInDb.word === word.word))
    const wordsInDb = words.filter(word => listOfWords.find(wordInDb => wordInDb.word === word.word))

    const wordsToCreate = await prisma.word.createMany({
        data: wordsNotInDb.map(word => ({
            word: word.word,
            languageId: language.id,
            frequency: word.count
        }))
    })


}