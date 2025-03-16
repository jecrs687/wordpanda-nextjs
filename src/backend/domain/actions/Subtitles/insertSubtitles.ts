import prisma from "@infra/config/database"
import { MediaType, Prisma } from "@prisma/client"
import { envs } from "@utils/envs"
import { processSubtitlePrime } from "@utils/subtitle"
import { readFileSync, writeFileSync } from "fs"
import { LANGUAGES } from "../../../infra/database/migration/languages/constants/LANGUAGES"

var wordsWritingFlag: NodeJS.Timeout | undefined;
const wordWritingBlock = async () => await new Promise((resolve) => {
    resolve('');
    return;
    const check = () => {
        if (wordsWritingFlag) setTimeout(check, 50 * Math.random() + 50)
        else resolve('resolved')
    }
    check()
})
const blockWritingWords = async () => {
    await wordWritingBlock();
    return wordsWritingFlag = setInterval(() => {
        wordsWritingFlag = undefined
    }, 100)
}
const unBlockWritingWords = () => {
    if (wordsWritingFlag)
        clearInterval(wordsWritingFlag)
    wordsWritingFlag = undefined;
}
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
    categories: {
        [key: string]: string[]
    },
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
                const name = subtitle.name;
                console.time(`${name} - process`);
                await wordWritingBlock();
                const platformInDb = await prisma.platform.findFirst({
                    where: {
                        name: subtitle.platform
                    }
                })
                console.log(`${name} - platform in db: ${platformInDb ? 'found' : 'not found'}`);
                if (!platformInDb) {
                    await blockWritingWords();
                    await prisma.platform.create({
                        data: {
                            name: subtitle.platform,
                            url: subtitle.platformLink || 'temporary',
                        }
                    })
                    unBlockWritingWords();
                }
                await wordWritingBlock();
                const platform = platformInDb || await prisma.platform.findFirst({
                    where: {
                        name: subtitle.platform
                    }
                })
                await wordWritingBlock();
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
                    },
                    include: {
                        subtitles: true
                    }
                })
                console.log(`${name} - media in db: ${media ? 'found' : 'not found'}`);

                if (!media) {
                    await blockWritingWords();
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
                    unBlockWritingWords();
                }


                const subtitles = await Promise.all(
                    subtitle.links
                        .filter(x => !media?.subtitles?.some(y => y.url == x.url && y.downloaded))
                        .map(async link => ({ ...link, subtitle: await processSubtitlePrime(link.url) })))
                console.log(`${name} - subtitles processed: ${subtitles.length}`);
                const divideByLanguage = subtitles.reduce((acc: typeof subtitles[], curr) => {
                    const languageCode = curr.languageCode?.split('-')[0] || curr?.subtitle?.jsonFromTTML?.lang?.split('-')[0] || 'undefined';
                    const firstWithoutLanguage = acc.findIndex(x => !x.some(y => y.languageCode?.split('-')[0] == languageCode))
                    if (firstWithoutLanguage == -1) return [...acc, [curr]]
                    acc[firstWithoutLanguage].push(curr)
                    return acc
                }, [])
                for (const subtitles of divideByLanguage) {
                    await Promise.all(subtitles.map(async sub => {
                        const languageCode = sub.languageCode?.split('-')[0] || sub?.subtitle?.jsonFromTTML?.lang?.split('-')[0] || 'undefined';
                        await wordWritingBlock();
                        const language = await prisma.language.findFirst({
                            where: {
                                code: {
                                    startsWith: languageCode
                                }
                            }
                        })
                        if (!language) {
                            await blockWritingWords();
                            await prisma.language.create({
                                data: {
                                    code: languageCode,
                                    language: LANGUAGES.find(language => language.code?.split('-')[0] === languageCode)?.language || languageCode
                                }
                            })
                            unBlockWritingWords();
                        }
                        await wordWritingBlock();
                        const languageInDb = language || await prisma.language.findFirst({
                            where: {
                                code: {
                                    startsWith: languageCode
                                }
                            }
                        })

                        if (!words[languageCode]) return
                        const wordsAllowed = sub.subtitle.words.filter(word => words[languageCode].includes(word.word.toLowerCase()))
                        console.log(`${name} - words allowed: ${wordsAllowed.length}`);
                        await wordWritingBlock();
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
                        await blockWritingWords();
                        const wordsCreated = await prisma.word.createMany({
                            data: wordsNotInDb.map(word => ({
                                word: word.word,
                                languageId: languageInDb.id,
                                frequency: word.count
                            }))
                        })
                        unBlockWritingWords();
                        console.log(`${name} - words created: ${wordsCreated.count}`);
                        await wordWritingBlock();
                        const allWordsInDb = await prisma.word.findMany({
                            where: {
                                word: {
                                    in: wordsAllowed.map(word => word.word.toLowerCase())
                                },
                                languageId: languageInDb.id
                            }
                        })
                        await wordWritingBlock();
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
                            },
                            include: {
                                subtitles: true
                            }
                        })
                        if (!mediaInDb?.subtitles?.some(y => y.url == sub.url)) {
                            await blockWritingWords();
                            await prisma.subtitle.create({
                                data: {
                                    mediaId: mediaInDb.id,
                                    url: sub.url,
                                    downloaded: false,
                                    languageId: languageInDb.id
                                }
                            })
                            unBlockWritingWords();
                        }
                        await wordWritingBlock();
                        const mediaLanguage = await prisma.mediaLanguages.findFirst({
                            where: {
                                mediaId: mediaInDb.id,
                                languageId: languageInDb.id
                            }
                        })
                        console.log(`${name} - media ${languageInDb.code} in db: ${mediaLanguage ? 'found' : 'not found'}`);
                        if (!mediaLanguage) {
                            await blockWritingWords();
                            await prisma.mediaLanguages.create({
                                data: {
                                    mediaId: mediaInDb.id,
                                    languageId: languageInDb.id,
                                    ...(subtitle.categories?.[languageInDb.code.split('-')[0]] && {
                                        categories: subtitle.categories[languageCode]
                                    })
                                }
                            })
                            unBlockWritingWords();
                            const mocks = readFileSync('./src/backend/domain/actions/Subtitles/mocks.json', 'utf-8',);
                            const mock = JSON.parse(mocks) as { [key: string]: { frequency: number } };
                            listOfWords.forEach(word => {
                                const wordInMock = mock[word.id] || { frequency: 0 }
                                mock[word.id] = {
                                    frequency: wordInMock.frequency + word.frequency
                                }
                            })
                            writeFileSync('./src/backend/domain/actions/Subtitles/mocks.json', JSON.stringify(mock, null, 2), 'utf-8');
                        }
                        await wordWritingBlock();
                        const mediaLanguageInDb = mediaLanguage || await prisma.mediaLanguages.findFirst({
                            where: {
                                mediaId: mediaInDb.id,
                                languageId: languageInDb.id
                            }
                        })
                        await wordWritingBlock();
                        const wordsInMedia = await prisma.mediaWords.findMany({
                            where: {
                                mediaLanguageId: mediaLanguageInDb.id,
                                wordId: {
                                    in: allWordsInDb.map(word => word.id)
                                }
                            }
                        })
                        console.log(`${name} - words in media: ${wordsInMedia.length}`);
                        const wordsNotInMedia = allWordsInDb.filter(word => !wordsInMedia.find(wordInMedia => wordInMedia.wordId === word.id))
                        await blockWritingWords();
                        const wordsInMediaToCreate = await prisma.mediaWords.createMany({
                            data: wordsNotInMedia.map(word => ({
                                mediaLanguageId: mediaLanguageInDb.id,
                                wordId: word.id,
                                frequency: word.frequency
                            }))
                        })
                        unBlockWritingWords();
                        console.log(`${name} - words in media created: ${wordsInMediaToCreate.count}`);
                        await wordWritingBlock();
                        const subtitleInDb = await prisma.subtitle.findFirst({
                            where: {
                                url: sub.url
                            }
                        })
                        await blockWritingWords();
                        await prisma.subtitle.update({
                            data: {
                                downloaded: true
                            },
                            where: {
                                id: subtitleInDb.id
                            }
                        })
                        unBlockWritingWords();
                    }));
                }
                console.timeEnd(`${name} - process`);
            }, {
                maxWait: +envs.POOL_INSERT_SUBTITLE_TRANSACTION_MAX_WAIT || 10000,
                timeout: +envs.POOL_INSERT_SUBTITLE_TRANSACTION_TIMEOUT || 20000,
                isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
            })
            return { success: true }
        }
        catch (e) {
            if (retry < 5) {
                console.log('Error inserting subtitles, retrying', retry + 1)
                console.error(e)
                return await insertSubtitles(subtitles, retry + 1)
            }
            console.log('Error inserting subtitles')
            console.log(e)
            return { success: false }
        }
    }
}