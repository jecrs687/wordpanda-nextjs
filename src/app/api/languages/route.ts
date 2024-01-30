// import { insertWords } from '@infra/database'

import prisma from "@infra/config/database"
import { Language } from "@prisma/client"




export type LanguagesGetResponse = {
    data?: {
        languages: Language[]
    },
    err?: string,
    msg?: string
}

export async function GET(request: Request) {
    const languages = await prisma.language.findMany()
    return Response.json({
        data: {
            languages
        },
        err: null,
        msg: 'Languages fetched'
    })
}

