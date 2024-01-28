import prisma from "@infra/config/database";
import { UserWords } from "@prisma/client";
import { validateToken } from "@utils/token";
import { cookies } from "next/headers";



export type GamesFlashcardPostRequest = {
    wordId: number,
    hard: boolean
}

export type GamesFlashcardPostResponse = {
    data?: {
        userWords: UserWords,
    },
    err?: string | null,
    msg?: string,
}
export async function POST(request: Request) {
    const body: {
        wordId: number,
        hard: boolean
    } = await request.json();
    const token = cookies().get('token')
    const { decoded: decryptToken } = validateToken(token)
    if (!decryptToken) return Response.json({ err: 'Token invalid' });
    try {
        const [user, word] = await Promise.all([
            await prisma.user.findFirst({
                where: {
                    id: decryptToken.id
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


        const userLanguage = async () => await prisma.userLanguage.findFirst({
            where: {
                id: user.id,
                languageId: word.languageId
            }
        })

        if (!await userLanguage()) {
            await prisma.userLanguage.create({
                data: {
                    userId: user.id,
                    languageId: word.languageId
                }
            })
        }

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
                    userLanguageId: (await userLanguage()).id,
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
                userLanguageId: (await userLanguage()).id,
                wordId: word.id,
            },
            include: {
                word: true
            }
        })
        const response: GamesFlashcardPostResponse = {
            data: {
                userWords: userWordFinal
            },
            err: null,
            msg: 'Word updated'
        }
        return Response.json(response);
    }
    catch (err) {
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