// import { insertWords } from '@infra/database'

import prisma from "@infra/config/database"
import { translateWords } from "@infra/openai/Translate"
import { TRANSLATED_WORDS_MOCK_ITALIAN } from "@mocks/translatedWordsMock"
import { Translation, UserWords, Word } from "@prisma/client"
import { chunkArray } from "@utils/chunkarray"
import { cookies, headers } from "next/headers"





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
        wordsNotOnDb: {
            word: string
        }[]
    },
    err?: string,
    msg?: string
}
export type WordsPostRequest = {
    words: { word: string }[],
    language: string,
}
export async function POST(request: Request) {
    const header = headers()

    try {
        console.time('before chat')
        const body: WordsPostRequest = await request.json();
        const id = +header.get('id')
        const languageCode = body.language.toLowerCase()?.split('-')[0]
        const [user, language] = await Promise.all([await prisma.user.findUnique({
            where: {
                id
            },
            include: {
                language: true
            }
        }),
        await prisma.language.findFirst({
            where: {
                code: {
                    startsWith: languageCode
                }
            },
        })
        ])
        const languageId = 59 || +cookies().get('language')?.value || +headers().get('language') || user?.languageId
        if (!user) return Response.json({
            err: 'Not authorized'
        })

        if (!language) return Response.json({
            err: 'Language not found'
        })
        const translationLanguageTarget = await prisma.language.findFirst({
            where: {
                code: {
                    startsWith: 'pt'
                }
            },
        })
        if (!translationLanguageTarget) return Response.json({
            err: 'Translation language not found'
        })
        const wordsOnDb = await prisma.word.findMany({
            where: {
                word: {
                    in: body.words.map(word => word.word.toLowerCase()),
                },
                languageId: language.id,
                isNotPossibleTranslate: false
            },
            include: {
                translations: {
                    where: {
                        languageId: translationLanguageTarget.id
                    }

                }
            }
        })

        const wordsWithoutTranslation = wordsOnDb.filter(word => !word.translations.length)
        const wordsNotOnDb = body.words.filter(word => !wordsOnDb.map(x => x.word).includes(word.word))

        const getTranslations = async () => await Promise.all(
            chunkArray(wordsWithoutTranslation, 40).map(
                async words => await translateWords(
                    words.map(word => word?.word?.toLowerCase()),
                    body.language,
                    translationLanguageTarget.code
                )
            ))
        const getMock = async () => {
            return TRANSLATED_WORDS_MOCK_ITALIAN
                .map(
                    (values) => Object.fromEntries(
                        Object.entries(
                            values
                        ).filter(
                            ([key, value]) => wordsWithoutTranslation.map(({ word }) => word).includes(key)
                        )
                    )
                )
        }
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
                word: {
                    in: body.words.map(word => word.word.toLowerCase()),
                },
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
                words: words.sort(
                    ({ userWords }, { userWords: userWords2 }) => {
                        if (!userWords?.length)
                            return -1
                        if (!userWords2?.length)
                            return 1
                        if (userWords.length !== userWords2.length)
                            return userWords.length > userWords2.length ? 1 : -1
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
                        return 1
                    }
                )
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

// export async function POST(request: Request) {
//     const cookie = cookies().getAll()

//     const body = await request.json()
//     const { words, jsonFromTTML } = body
//     const dictionaryWords = dictionary as { [key: string]: string }
//     // await insertWords(words, jsonFromTTML.lang as string)
//     const response = words.map((word: { word: string }) => {
//         const wordData = dictionaryWords[word?.word]
//         if (!wordData) return { ...word, translation: 'Not found' }
//         return { ...word, translation: wordData }
//     })


//     return NextResponse.json(response)
// }