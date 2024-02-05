import prisma from "@infra/config/database";
import { generateQuizByWords } from "@infra/openai/Quiz";
import { Language, Word, WordGameQuiz } from "@prisma/client";
import { chunkArray } from "@utils/chunkarray";
import { validateToken } from "@utils/token";
import { cookies } from "next/headers";


export type GamesQuizPostRequest = {
    words: number[]
}

export type GamesQuizPostResponse = {
    data?: {
        words: Array<
            Word & {
                wordGameQuiz: WordGameQuiz[],
                language: Language
            }
        >,
    },
    err?: string | null,
    msg?: string,
}
export async function POST(request: Request) {
    const token = cookies().get('token')

    const { decoded: decryptToken } = validateToken(token)
    if (!decryptToken) return Response.json({ err: 'Token invalid' });
    const user = await prisma.user.findFirst({
        where: {
            id: decryptToken.id
        },
        include: {
            language: true,
        }
    })
    if (!user) return Response.json({ err: 'User not found' })

    const {
        words
    }: GamesQuizPostRequest = await request.json();

    const [wordsOnDb, language] = await Promise.all([await prisma.word.findMany({
        where: {
            id: {
                in: words
            }
        },
        include: {
            language: true,
            wordGameQuiz: true
        }
    }), await prisma.language.findUnique({
        where: {
            id: +cookies().get('language').value
        }
    })])
    if (!wordsOnDb.length) return Response.json({ err: 'Words not found' })
    if (!language) return Response.json({ err: 'Language not found' })
    const wordsWithoutGames = wordsOnDb.filter(word => !word.wordGameQuiz.length).map(word => word.word)
    const quiz = (await Promise.all(chunkArray(wordsWithoutGames, 5).map(async words =>
        await generateQuizByWords(words, wordsOnDb?.[0]?.language.language, language.language)
    ))).flat().reduce((acc, curr) => ({ ...acc, ...curr }), {})

    for (const [key, { quiz: quizToTranslate, options, correct }] of Object.entries(quiz)) {
        const wordId = wordsOnDb.find(word => word.word === key)?.id
        if (!wordId) continue
        const wordGame = await prisma.wordGameQuiz.create({
            data: {
                phrase: quizToTranslate,
                answer: correct,
                options,
                wordId,
                languageId: language.id
            }
        })
        await prisma.word.update({
            where: {
                id: wordId
            },
            data: {
                wordGameQuiz: {
                    connect: {
                        id: wordGame.id
                    }
                }
            }
        })
    }

    const wordsList = wordsWithoutGames.length ? wordsOnDb : await prisma.word.findMany({
        where: {
            id: {
                in: words
            }
        },
        include: {
            language: true,
            wordGameQuiz: {
                where: {
                    languageId: language.id
                }
            }
        }
    })

    const response: GamesQuizPostResponse = {
        data: {
            words: wordsList
        },
        err: null,
        msg: 'Quiz generated'

    }
    return Response.json(response)
}