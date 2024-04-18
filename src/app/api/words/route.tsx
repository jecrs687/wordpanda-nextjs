// import { insertWords } from '@infra/database'

import prisma from "@infra/config/database"
import { translateWords } from "@infra/openai/Translate"
import { Translation, UserWords, Word } from "@prisma/client"
import { chunkArray } from "@utils/chunkarray"
import { validateToken } from "@utils/token"
import { headers } from "next/headers"



const sortWords = ({ userWords, frequency }, { userWords: userWords2, frequency: frequency2 }) => {
    if (!userWords?.length && !userWords2?.length) return frequency > frequency2 ? -1 : 1
    if (userWords?.[0]?.errors / userWords?.[0]?.attempts !== userWords2?.[0]?.errors / userWords2?.[0]?.attempts)
        return userWords?.[0]?.errors / userWords?.[0]?.attempts > userWords2?.[0]?.errors / userWords2?.[0]?.attempts ? -1 : 1
    if (userWords?.[0]?.lastSuccess !== userWords2?.[0]?.lastSuccess) return
    userWords?.[0]?.lastSuccess > userWords2?.[0]?.lastSuccess ? -1 : 1
    if (userWords?.[0]?.lastError !== userWords2?.[0]?.lastError)
        return userWords?.[0]?.lastError > userWords2?.[0]?.lastError ? -1 : 1
    if (userWords?.[0]?.lastAttempt !== userWords2?.[0]?.lastAttempt)
        return userWords?.[0]?.lastAttempt > userWords2?.[0]?.lastAttempt ? -1 : 1
    if (userWords?.[0]?.notLearned !== userWords2?.[0]?.notLearned)
        return userWords?.[0]?.notLearned ? -1 : 1
    if (userWords?.length !== userWords2?.length)
        return userWords?.length > userWords2?.length ? 1 : -1
    if (!userWords?.length) return -1
    if (!userWords2?.length) return 1
    return 1
}


export type WordWithTranslations = Word & {
    translations?: Array<Translation & {
        translations: Word[]
    }>,
}
export type WordWithTranslationsAndUserWords = WordWithTranslations & {
    userWords: UserWords[]
}


export type WordsPostResponse = {
    data?: {
        wordsOnDb: Word[],
        words: WordWithTranslationsAndUserWords[],
        wordsNotOnDb: string[]
    },
    err?: string,
    msg?: string
}
export type WordsPostRequest = {
    words?: string[],
    language?: string,
    mediaId?: string,
    languageId?: number,
    limit?: number
}
export async function POST(request: Request) {
    const header = headers()

    try {
        console.time('before chat')
        const body: WordsPostRequest = await request.json();
        const userId = header.get('id') || validateToken((header.get('Authorization') || ""))?.decoded?.id
        const { languageId, mediaId, limit } = body
        const [user, language] = await Promise.all([await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                language: true
            }
        }),
        languageId ?
            await prisma.language.findFirst({
                where: {
                    id: languageId
                },
            })
            : await prisma.language.findFirst({
                where: {
                    OR: [
                        {
                            code: {
                                startsWith: body.language?.toLowerCase()?.split('-')[0]
                            }
                        },
                        {
                            language: {
                                contains: body.language?.toLowerCase()
                            }
                        }
                    ]
                },
            })
        ])
        if (!user) return Response.json({
            err: 'Not authorized'
        })

        if (!language) return Response.json({
            err: 'Language not found'
        })
        const translationLanguageTarget = await prisma.language.findFirst({
            where: {
                id: user.languageId
            },
        })
        if (!translationLanguageTarget) return Response.json({
            err: 'Translation language not found'
        })
        const wordsWhere = {}
        if (body.words?.length) Object.assign(wordsWhere, {
            word: {
                in: body.words.map(word => word.toLowerCase()),
            }
        })
        if (mediaId) Object.assign(wordsWhere, {
            mediaWords: {
                some: {
                    mediaLanguage: {
                        mediaId,
                    }
                }
            }
        })

        const wordsOnDb = (await prisma.word.findMany({
            where: {
                ...wordsWhere,
                languageId: language.id,
                isNotPossibleTranslate: false,
            },
            include: {
                userWords: {
                    where: {
                        userId: user.id
                    }
                },
                translations: {
                    where: {
                        languageId: translationLanguageTarget.id
                    }
                },
                mediaWords: {
                    include: {
                        mediaLanguage: true
                    }
                }
            },
        })).sort(sortWords).slice(0, limit * 2)
        const wordsWithoutTranslation = wordsOnDb.filter(word => !word.translations.length)
        const wordsNotOnDb = body?.words?.filter(word => !wordsOnDb.map(x => x.word).includes(word)) || []

        const getTranslations = async () => await Promise.all(
            chunkArray(wordsWithoutTranslation, 40).map(
                async words => await translateWords(
                    words.map(word => word?.word?.toLowerCase()),
                    body.language,
                    translationLanguageTarget.code
                )
            ))
        console.timeEnd('before chat')
        console.log("missing words: " + wordsWithoutTranslation.length)
        console.log(JSON.stringify({
            language,
            translationLanguageTarget
        }, null, 2))
        console.time('during chat')
        const translatedWords = await getTranslations()
        console.timeEnd('during chat')
        console.time("after chat")
        const translatedWordsFlat = translatedWords.reduce((acc, val) => ({ ...acc, ...val }), {})
        const translationWords = Object.entries(translatedWordsFlat).map(([key, words]) => words?.translation?.map((value) => [key, value]) || []).flat()
        const translationsOnDb = await prisma.word.findMany({
            where: {
                word: {
                    in: translationWords.map(([key, word]) => [word.toLowerCase(), word]).flat()
                },
                languageId: translationLanguageTarget.id
            }
        })
        const translationWordsOnDbFlat = translationsOnDb.map(x => x.word.toLowerCase())
        const translationsNotOnDb = translationWords
            .filter(
                ([key, word]) =>
                    !translationWordsOnDbFlat.includes(word.toLowerCase())
            )
        const notTranslatedWords = wordsWithoutTranslation.map(x => x.word.toLowerCase()).filter(
            x => !Object.keys(translatedWordsFlat).includes(x)
        )

        try {
            await Promise.all(
                notTranslatedWords.map(async (key) => {
                    const word = wordsOnDb.find(x => x.word === key);
                    await prisma.word.update({
                        where: {
                            id: word.id
                        },
                        data: {
                            isNotPossibleTranslate: true
                        }
                    })
                })
            )
        } catch (err) {
            console.log(err)
        }

        const translationWordsToCreate = Array.from(new Set(translationsNotOnDb.map(([key, word]) => word.toLowerCase())))

        await prisma.word.createMany({
            data: translationWordsToCreate.map((word) => ({
                word: word,
                languageId: translationLanguageTarget.id
            }))
        })

        const translationWordsOnDb = await prisma.word.findMany({
            where: {
                word: {
                    in: Array.from(translationWords).map(([key, word]) => word.toLowerCase())
                },
                languageId: translationLanguageTarget.id
            }
        })
        await Promise.all(
            Object.entries(translatedWordsFlat).map(async ([key, words]) => {
                const word = wordsOnDb.find(x => x.word === key.toLowerCase());
                const translations = translationWordsOnDb.filter(x => words?.translation.map(word => word.toLowerCase())?.includes(x.word.toLowerCase()))
                try {
                    if (!translations.length) return await prisma.word.update({
                        where: {
                            id: word.id
                        },
                        data: {
                            isNotPossibleTranslate: true
                        }
                    })
                    await prisma.word.update({
                        where: {
                            id: word.id
                        },
                        data: {
                            translations: {
                                create: {
                                    meaning: words?.meaning?.join('\n'),
                                    meaningTranslated: words?.meaningTranslated?.join('\n'),
                                    translations: {
                                        connect: translations.map(({ id }) => ({ id }))
                                    },
                                    languageId: translationLanguageTarget.id
                                }
                            }
                        }
                    })
                }
                catch (err) {
                    console.log({ err })
                }
            })
        )
        const words = await prisma.word.findMany({
            where: {
                ...wordsWhere,
                languageId: language.id,
                translations: {
                    some: {
                        languageId: translationLanguageTarget.id
                    }
                },
                isNotPossibleTranslate: false
            },
            include: {
                userWords: {
                    where: {
                        userId: user.id
                    },
                },
                translations: {
                    where: {
                        languageId: translationLanguageTarget.id
                    },
                    include: {
                        translations: {
                            where: {
                                languageId: translationLanguageTarget.id
                            }
                        }
                    }
                }
            }
        })
        console.timeEnd("after chat")
        const response: WordsPostResponse = {
            data: {
                wordsOnDb,
                wordsNotOnDb,
                words: words.sort(sortWords).slice(0, limit)
            },
            err: null,
            msg: 'Words fetched'
        }
        return Response.json(response)
    }
    catch (err) {
        console.log(err)
        return Response.json({
            err: err.message,
            msg: 'Error'
        })
    }
}
