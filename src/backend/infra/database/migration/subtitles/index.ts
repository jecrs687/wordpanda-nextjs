import prisma from "@infra/config/database"
import { SUBTITLES_MOCK } from "@mocks/subtitlesLinksmocks"
import { MediaType } from "@prisma/client"
import { getText, orderWords, ttml2ToJson } from "@utils/subtitle"
import { LANGUAGES } from "../languages/constants/LANGUAGES"

export const subtitleMock = async () => {

    for (const subtitle of SUBTITLES_MOCK) {

        if (!await prisma.platform.findFirst({
            where: {
                name: subtitle.platform
            }
        })) {
            await prisma.platform.create({
                data: {
                    name: subtitle.platform,
                    url: 'https://www.primevideo.com/'
                }
            })
        }
        const platform = await prisma.platform.findFirst({
            where: {
                name: subtitle.platform
            }
        })

        const subtitles = await Promise.all(subtitle.links.map(async link => {
            const something = await getText(link)
            const jsonFromTTML = ttml2ToJson(something)
            const json = jsonFromTTML.subtitles
            const words = await orderWords(json)
            return { words, jsonFromTTML }
        }))
        for (const sub of subtitles) {

            const language = await prisma.language.findFirst({
                where: {
                    code: {
                        startsWith: sub?.jsonFromTTML?.lang?.toLocaleLowerCase()
                    }
                }
            })
            if (!language) {
                await prisma.language.create({
                    data: {
                        code: sub?.jsonFromTTML?.lang?.toLocaleLowerCase(),
                        language: LANGUAGES.find(language => language.code === sub?.jsonFromTTML?.lang?.toLocaleLowerCase())?.language || sub?.jsonFromTTML?.lang?.toLocaleLowerCase()
                    }
                })
            }
            const languageInDb = await prisma.language.findFirst({
                where: {
                    code: {
                        startsWith: sub?.jsonFromTTML?.lang?.toLocaleLowerCase()
                    }
                }
            })
            const listOfWords = await prisma.word.findMany({
                where: {
                    word: {
                        in: sub.words.map(word => word.word.toLowerCase())
                    },
                    languageId: languageInDb.id
                }
            })
            const wordsNotInDb = sub.words.filter(word => !listOfWords.find(wordInDb => wordInDb.word === word.word))
            const wordsInDb = sub.words.filter(word => listOfWords.find(wordInDb => wordInDb.word === word.word))
            const wordsCreated = await prisma.word.createMany({
                data: wordsNotInDb.map(word => ({
                    word: word.word,
                    languageId: languageInDb.id,
                    frequency: word.count
                }))
            })

            const allWordsInDb = await prisma.word.findMany({
                where: {
                    word: {
                        in: sub.words.map(word => word.word.toLowerCase())
                    },
                    languageId: languageInDb.id
                }
            })

            const media = await prisma.media.findFirst({
                where: {
                    name: subtitle.name
                }
            })
            if (!media) {
                await prisma.media.create({
                    data: {
                        name: subtitle.name,
                        platformId: platform.id,
                        url: 'https://www.primevideo.com/',
                        type: MediaType.MOVIE,
                        logoUrl: subtitle?.image || "https://picsum.photos/500/1000"
                    }
                })
            }
            const mediaInDb = await prisma.media.findFirst({
                where: {
                    name: subtitle.name
                }
            })
            const mediaLanguage = await prisma.mediaLanguages.findFirst({
                where: {
                    mediaId: mediaInDb.id,
                    languageId: languageInDb.id
                }
            })
            if (!mediaLanguage) {
                await prisma.mediaLanguages.create({
                    data: {
                        mediaId: mediaInDb.id,
                        languageId: languageInDb.id,
                    }
                })
            }
            const mediaLanguageInDb = await prisma.mediaLanguages.findFirst({
                where: {
                    mediaId: mediaInDb.id,
                    languageId: languageInDb.id
                }
            })

            const wordsInMedia = await prisma.mediaWords.findMany({
                where: {
                    mediaLanguageId: mediaLanguageInDb.id,
                    wordId: {
                        in: allWordsInDb.map(word => word.id)
                    }
                }
            })
            const wordsNotInMedia = allWordsInDb.filter(word => !wordsInMedia.find(wordInMedia => wordInMedia.wordId === word.id))
            const wordsInMediaToCreate = await prisma.mediaWords.createMany({
                data: wordsNotInMedia.map(word => ({
                    mediaLanguageId: mediaLanguageInDb.id,
                    wordId: word.id
                }))
            })

        }

    }

}