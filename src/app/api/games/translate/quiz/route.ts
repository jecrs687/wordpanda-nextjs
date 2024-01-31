import prisma from "@infra/config/database";
import { generateQuizByWords } from "@infra/openai/Quiz";
import { Language, Word, WordGameTranslateQuiz } from "@prisma/client";
import { validateToken } from "@utils/token";
import { cookies } from "next/headers";


export type GamesTranslateQuizPostRequest = {
    words: number[],
}

export type GamesTranslateQuizPostResponse = {
    data?: {
        words: Array<
            Word & {
                wordGameTranslateQuiz: WordGameTranslateQuiz[],
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
    }: GamesTranslateQuizPostRequest = await request.json();

    const [wordsOnDb, language] = await Promise.all([await prisma.word.findMany({
        where: {
            id: {
                in: words
            }
        },
        include: {
            language: true,
            wordGameTranslateQuiz: true
        }
    }), await prisma.language.findUnique({
        where: {
            id: +cookies().get('language').value
        }
    })])
    if (!wordsOnDb.length) return Response.json({ err: 'Words not found' })
    if (!language) return Response.json({ err: 'Language not found' })

    const wordsWithoutGames = wordsOnDb.filter(word => !word.wordGameTranslateQuiz.length).map(word => word.word)
    const quiz = generateQuizByWords(wordsWithoutGames, wordsOnDb[0].language.language, language.language)

    for (const [key, { quiz: quizToTranslate, options }] of Object.entries(quiz)) {
        const wordId = wordsOnDb.find(word => word.word === key)?.id
        if (!wordId) continue
        const wordGame = await prisma.wordGameTranslateQuiz.create({
            data: {
                phrase: quizToTranslate,
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
                wordGameTranslateQuiz: {
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
            wordGameTranslateQuiz: true
        }
    })

    const response: GamesTranslateQuizPostResponse = {
        data: {
            words: wordsList
        },
        err: null,
        msg: 'Quiz generated'

    }
    return Response.json(response)
}