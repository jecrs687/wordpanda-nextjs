// import { insertWords } from '@infra/database'
import prisma from '@infra/config/database'
import { validateToken } from '@utils/token'
import { headers } from 'next/headers'


export type UserLanguagePutResponse = {
    err?: string,
    msg?: string
}
export type UserLanguagePutRequest = {
    languageId: number
}


export async function PUT(request: Request) {
    const body: UserLanguagePutRequest = await request.json();
    const userId = (await headers()).get("id") || validateToken(request.headers.get('Authorization') || '')?.decoded?.id
    const language = await prisma.language.findUnique({
        where: {
            id: body.languageId
        }
    })
    if (!language) return Response.json({
        err: 'Language not found'
    })
    const userOnDb = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })
    if (!userOnDb) return Response.json({
        err: 'user not found'
    })

    const user = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            languageId: language.id
        }
    })

    return Response.json(
        user
    )
}



