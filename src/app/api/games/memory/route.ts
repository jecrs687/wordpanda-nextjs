import prisma from "@infra/config/database";
import { UserWords } from "@prisma/client";
import { validateToken } from "@utils/token";
import { cookies, headers } from "next/headers";



export type GamesMemoryPostRequest = {
    wordId: string,
    hard: boolean,
    mediaId?: string
}

export type GamesMemoryPostResponse = {
    data?: {
        userWords: UserWords,
    },
    err?: string | null,
    msg?: string,
}
export async function POST(request: Request) {
    const body: GamesMemoryPostRequest = await request.json();
    const token = cookies().get('token') || headers().get('Authorization')
    const { decoded: decryptToken } = validateToken(token)
    if (!decryptToken) return Response.json({ err: 'Token invalid' });
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

        if (!user) return Response.json({ err: 'User not found' })
        if (!word) return Response.json({ err: 'Word not found' })
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
        return Response.json(response);
    }
    catch (err) {
        console.log({ err })
        return Response.json({ err });
    }

}

export async function GET() {
    const res = await fetch('https://data.mongodb-api.com/...', {
        headers: {
            'Content-Type': 'application/json',
            'API-Key': process.env.DATA_API_KEY,
        },
    })
    const data = await res.json()

    return Response.json({ data })
}