import prisma from "@infra/config/database"
import { MediaType, Prisma } from "@prisma/client"
import { envs } from "@utils/envs"
import { PromisePoll } from "@utils/promisePoll"
import { processSubtitlePrime } from "@utils/subtitle"
import { LANGUAGES } from "../../../infra/database/migration/languages/constants/LANGUAGES"


export interface IInsertSubtitles {
    name: string,
    platform: string,
    image: string,
    type?: MediaType,
    season?: number,
    episode?: number,
    title?: string,
    mediaId?: string,
    seasonId?: string,
    serieId?: string,
    episodeId?: string,
    platformLink?: string,
    images?: {
        [key: string]: string
    }
    links: {
        url: string,
        languageCode?: string
        language?: string
    }[]
}
const words = {
    "en": require("@backend/infra/constants/words_in_english.json").map(word => word.toLowerCase()),
    "it": require("@backend/infra/constants/words_in_italian.json").map(word => word.toLowerCase()),
    "fr": require("@backend/infra/constants/words_in_french.json").map(word => word.toLowerCase()),
    "de": require("@backend/infra/constants/words_in_german.json").map(word => word.toLowerCase()),
    "es": require("@backend/infra/constants/words_in_spanish.json").map(word => word.toLowerCase()),
    "pt": require("@backend/infra/constants/words_in_portuguese.json").map(word => word.toLowerCase())
}
export const insertSubtitles = async (subtitles: IInsertSubtitles[], retry: number = 0) => {
    for (const subtitle of subtitles) {
        try {
            await prisma.$transaction(async (prisma) => {
                const platformInDb = await prisma.platform.findFirst({
                    where: {
                        name: subtitle.platform
                    }
                })
                if (!platformInDb) {
                    await prisma.platform.create({
                        data: {
                            name: subtitle.platform,
                            url: subtitle.platformLink || 'temporary',
                        }
                    })
                }
                const platform = platformInDb || await prisma.platform.findFirst({
                    where: {
                        name: subtitle.platform
                    }
                })
                const media = await prisma.media.findFirst({
                    where: {
                        OR: [
                            {
                                id: subtitle.mediaId
                            },
                            {
                                name: subtitle.name
                            }
                        ]
                    }
                })

                if (!media) {
                    await prisma.media.create({
                        data: {
                            ...(subtitle?.mediaId && { id: subtitle.mediaId }),
                            name: subtitle.name,
                            url: subtitle.platformLink || 'temporary',
                            type: subtitle.type || MediaType.MOVIE,
                            logoUrl: subtitle?.image || "https://picsum.photos/500/1000",
                            platformId: platform.id,
                            images: {
                                createMany: {
                                    data: Object.entries(subtitle.images).map(([type, url]) => ({
                                        type,
                                        url
                                    }))
                                }
                            },
                            ...(subtitle.seasonId && {
                                serieMedias: {
                                    connectOrCreate: {
                                        where: {
                                            id: subtitle.seasonId
                                        },
                                        create: {
                                            id: subtitle.serieId,
                                            episode: subtitle.episode,
                                            season: subtitle.season,
                                            serie: {
                                                connectOrCreate: {
                                                    where: {
                                                        id: subtitle.serieId
                                                    },
                                                    create: {
                                                        id: subtitle.serieId,
                                                        name: subtitle.title
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }),
                            subtitles: {
                                create: subtitle.links.reduce((acc, curr) => {
                                    if (acc.find(link => link.languageCode?.split('-')[0] == curr.languageCode?.split('-')[0])) return acc
                                    return [...acc, curr]
                                }, []).map(link => ({
                                    url: link.url,
                                    language: {
                                        connectOrCreate: {
                                            where: {
                                                code: link.languageCode?.split('-')[0],
                                                OR: [
                                                    {
                                                        code: {
                                                            startsWith: link.languageCode?.split('-')[0]
                                                        }
                                                    },
                                                    {
                                                        language: {
                                                            startsWith: link.language
                                                        }
                                                    }
                                                ]
                                            },
                                            create: {
                                                code: link.languageCode?.split('-')[0] || LANGUAGES.find(language => language.language?.split('-')[0] === link.language?.split('-')[0])?.code || ('undefined-' + Math.random()),
                                                language: link.language || LANGUAGES.find(language => language.code?.split('-')[0] === link.languageCode?.split('-')[0])?.language || link.languageCode
                                            }
                                        }
                                    }
                                }))
                            }
                        }
                    })
                }


                const subtitles = await Promise.all(subtitle.links.map(async link => ({ ...link, subtitle: await processSubtitlePrime(link.url) })))
                for (const sub of subtitles) {
                    if (prisma.subtitle.findFirst({
                        where: {
                            url: sub.url
                        }
                    }) && media) continue;
                    const languageCode = sub.languageCode?.split('-')[0] || sub?.subtitle?.jsonFromTTML?.lang?.split('-')[0] || 'undefined';
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
                    const wordsAllowed = sub.subtitle.words.filter(word => words[languageCode].includes(word.word.toLowerCase()))

                    const listOfWords = await prisma.word.findMany({
                        where: {
                            word: {
                                in: wordsAllowed.map(word => word.word.toLowerCase())
                            },
                            languageId: languageInDb.id
                        }
                    })
                    const wordsNotInDb = wordsAllowed.filter(word => !listOfWords.find(wordInDb => wordInDb.word === word.word))
                    const wordsInDb = wordsAllowed.filter(word => listOfWords.find(wordInDb => wordInDb.word === word.word))
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
                                in: wordsAllowed.map(word => word.word.toLowerCase())
                            },
                            languageId: languageInDb.id
                        }
                    })

                    const mediaInDb = await prisma.media.findFirst({
                        where: {
                            OR: [
                                {
                                    id: subtitle.mediaId
                                },
                                {
                                    name: subtitle.name
                                }
                            ]
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
            }, {
                maxWait: envs.POOL_INSERT_SUBTITLE_TRANSACTION_MAX_WAIT || 10000,
                timeout: envs.POOL_INSERT_SUBTITLE_TRANSACTION_TIMEOUT || 20000,
                isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
            })
        }
        catch (e) {
            if (retry < 5)
                return await insertSubtitles(subtitles, retry + 1)
            console.log('Error inserting subtitles')
            console.log(e)
        }
    }
}