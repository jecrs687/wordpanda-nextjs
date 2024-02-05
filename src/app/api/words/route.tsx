// import { insertWords } from '@infra/database'

import prisma from "@infra/config/database"
import { translateWords } from "@infra/openai/Translate"
import { TRANSLATED_WORDS_MOCK_ITALIAN } from "@mocks/translatedWordsMock"
import { Translation, UserWords, Word } from "@prisma/client"
import { chunkArray } from "@utils/chunkarray"
import { validateToken } from "@utils/token"
import { cookies, headers } from "next/headers"




export type WordWithTranslations = Word & {
    translations?: Array<Translation & {
        translations: Word[]
    }>,
    userWords: UserWords[]
}


export type WordsPostResponse = {
    data?: {
        wordsOnDb: WordWithTranslations[],
        words: WordWithTranslations[],
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
    try {
        const token = cookies().get('token') || headers().get('Authorization')
        const languageId = cookies().get('language')?.value || headers().get('language')
        if (!token) return Response.json({
            err: 'Not authorized'
        })
        const { decoded } = validateToken(token)
        if (!decoded) return Response.json({
            err: 'Not authorized'
        })
        const { id } = decoded
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        })
        if (!user) return Response.json({
            err: 'Not authorized'
        })
        const body: WordsPostRequest = await request.json();
        const language = await prisma.language.findUnique({
            where: {
                code: body.language.toLowerCase()
            }
        })
        if (!language) return Response.json({
            err: 'Language not found'
        })
        const translationLanguageTarget = await prisma.language.findUnique({
            where: {
                id: +languageId
            }
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
        const translatedWords = await getTranslations()
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

        for (const key of notTranslatedWords) {
            const word = wordsOnDb.find(x => x.word === key);
            await prisma.word.update({
                where: {
                    id: word.id
                },
                data: {
                    isNotPossibleTranslate: true
                }
            })
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

        for (const [key, words] of Object.entries(translatedWordsFlat)) {
            const word = wordsOnDb.find(x => x.word === key.toLowerCase());
            const translations = translationWordsOnDb.filter(x => words?.translation?.includes(x.word.toLowerCase()))
            if (!translations.length) continue
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
        const words = await prisma.word.findMany({
            where: {
                word: {
                    in: body.words.map(word => word.word),
                },
                languageId: language.id,
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
                        translations: true
                    }
                }
            }
        })
        return Response.json({
            data: {
                wordsOnDb,
                wordsNotOnDb,
                words
            },
            err: null,
            msg: 'Words fetched'
        })
    }
    catch (err) {
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