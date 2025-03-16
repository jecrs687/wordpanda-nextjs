"use server";
import { TOKEN_KEY } from "@constants/CONFIGS";
import prisma from "@infra/config/database";
import { generateQuizByWords } from "@infra/openai/Quiz";
import { chunkArray } from "@utils/chunkarray";
import { validateToken } from "@utils/token";
import { cookies, headers } from "next/headers";
import { GamesQuizPostRequest, GamesQuizPostResponse } from "src/app/api/games/quiz/route";

export const quizGameAction = async ({ words }: GamesQuizPostRequest) => {
    const token = await cookies()?.get(TOKEN_KEY)?.value || (await headers()).get('Authorization')
    const { decoded: decryptToken } = validateToken(token)
    if (!decryptToken) return { err: 'Token invalid' };
    const user = await prisma.user.findFirst({
        where: {
            id: decryptToken.id
        },
        include: {
            language: true,
        }
    })
    if (!user) return { err: 'User not found' }
    const languageId = +((await cookies()).get('language')?.value || (await headers()).get('language') || user.languageId)


    const language = user.language || (await prisma.language.findFirst({
        where: {
            id: user.languageId
        }
    }))
    const [wordsOnDb] = await Promise.all([await prisma.word.findMany({
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
    }),])
    if (!wordsOnDb.length) return { err: 'Words not found' }
    if (!language) return { err: 'Language not found' }
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
    return response
}