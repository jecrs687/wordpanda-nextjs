import prisma from "@infra/config/database"
import { MediaType } from "@prisma/client"
import { PromisePoll } from "@utils/promisePoll"
import { getText, orderWords, ttml2ToJson } from "@utils/subtitle"
import { LANGUAGES } from "../../../infra/database/migration/languages/constants/LANGUAGES"

export const insertSubtitles = async (subtitles: {
    name: string,
    platform: string,
    image: string,
    links: string[]
}[]
) => {
    const words = {
        "en": require("@backend/infra/constants/words_in_english.json").map(word => word.toLowerCase()),
        "it": require("@backend/infra/constants/words_in_italian.json").map(word => word.toLowerCase()),
        "fr": require("@backend/infra/constants/words_in_french.json").map(word => word.toLowerCase()),
        "de": require("@backend/infra/constants/words_in_german.json").map(word => word.toLowerCase()),
        "es": require("@backend/infra/constants/words_in_spanish.json").map(word => word.toLowerCase()),
        "pt": require("@backend/infra/constants/words_in_portuguese.json").map(word => word.toLowerCase())
    }

    for (const subtitle of subtitles) {

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
            const languageCode = sub?.jsonFromTTML?.lang?.toLocaleLowerCase()?.split('-')[0]
            const language = await prisma.language.findFirst({
                where: {
                    code: {
                        startsWith: languageCode
                    }
                }
            })
            if (!language) {
                await prisma.language.create({
                    data: {
                        code: languageCode,
                        language: LANGUAGES.find(language => language.code?.split('-')[0] === languageCode)?.language || languageCode
                    }
                })
            }
            const languageInDb = await prisma.language.findFirst({
                where: {
                    code: {
                        startsWith: languageCode
                    }
                }
            })

            if (!words[languageCode]) continue
            sub.words = sub.words.filter(word => words[languageCode].includes(word.word.toLowerCase()))

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
                await PromisePoll(
                    listOfWords.map(async word => {
                        await prisma.word.update({
                            where: {
                                id: word.id
                            },
                            data: {
                                frequency: wordsInDb.find(wordInDb => wordInDb.word === word.word).count + word.frequency
                            }
                        })
                    }
                    ), 0, 10
                )
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