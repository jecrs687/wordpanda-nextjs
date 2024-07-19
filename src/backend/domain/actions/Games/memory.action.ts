"use server";
import { TOKEN_KEY } from "@constants/CONFIGS";
import prisma from "@infra/config/database";
import { validateToken } from "@utils/token";
import { cookies, headers } from "next/headers";
import { GamesMemoryPostRequest, GamesMemoryPostResponse } from "src/app/api/games/memory/route";

export const memoryGameAction = async (body: GamesMemoryPostRequest) => {
    const token = cookies().get(TOKEN_KEY) || headers().get('Authorization')
    const { decoded: decryptToken } = validateToken(token)
    if (!decryptToken) return { err: 'Token invalid' };
    try {
        const [user, word] = await Promise.all([
            await prisma.user.findFirst({
                where: {
                    id: decryptToken.id
                },
                include: {
                    language: true
                }
            }),
            await prisma.word.findFirst({
                where: {
                    id: body.wordId
                }
            })
        ])

        if (!user) return { err: 'User not found' }
        if (!word) return { err: 'Word not found' }

        if (body.mediaId) {
            const mediaUser = await prisma.mediaUser.findFirst({
                where: {
                    userId: decryptToken.id,
                    mediaLanguage: {
                        mediaId: body.mediaId,
                        languageId: word.languageId
                    }
                }
            })
            const mediaLanguage = await prisma.mediaLanguages.findFirst({
                where: {
                    mediaId: body.mediaId,
                    languageId: word.languageId
                }
            })
            if (!mediaUser) await prisma.mediaUser.create({
                data: {
                    userId: user.id,
                    mediaLanguageId: mediaLanguage.id
                }
            })
        }

        const language = await prisma.userLanguage.findFirst({
            where: {
                userId: user.id,
                languageId: word.languageId
            }
        })

        if (!language) {
            await prisma.userLanguage.create({
                data: {
                    userId: user.id,
                    languageId: word.languageId
                }
            })
        }
        const languageOnDb = language ?? await prisma.userLanguage.findFirst({
            where: {
                userId: user.id,
                languageId: word.languageId
            }
        })
        const verifyWord = await prisma.userWords.findFirst({
            where: {
                userId: user.id,
                wordId: word.id
            }
        })


        if (!verifyWord) {
            await prisma.userWords.create({
                data: {
                    userId: user.id,
                    userLanguageId: languageOnDb.id,
                    wordId: word.id,
                }
            })
        }
        const userWord = verifyWord ?? await prisma.userWords.findFirst({
            where: {
                userId: user.id,
                wordId: word.id
            }
        })
        await prisma.userWords.update({
            where: {
                id: userWord.id
            },
            data: {
                attempts: (userWord?.attempts || 0) + 1,
                errors: (userWord?.errors || 0) + (body.hard ? 1 : 0),
                streak: body.hard ? 0 : (userWord?.streak || 0) + 1,
                lastAttempt: new Date(),
                lastError: body.hard ? new Date() : userWord?.lastError,
            }
        })
        const userWordFinal = await prisma.userWords.findFirst({
            where: {
                userId: user.id,
                userLanguageId: languageOnDb.id,
                wordId: word.id,
            },
            include: {
                word: true
            }
        })
        const response: GamesMemoryPostResponse = {
            data: {
                userWords: userWordFinal
            },
            err: null,
            msg: 'Word updated'
        }
        return response;
    }
    catch (err) {
        console.log({ err })
        return { err };
    }
}