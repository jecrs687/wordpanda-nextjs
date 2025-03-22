import { flashGameAction } from "@/src/backend/domain/actions/Games/flash.action";
import { UserWords } from "@prisma/client";



export type GamesFlashcardPostRequest = {
    wordId: string,
    hard: boolean,
    mediaId?: string
}

export type GamesFlashcardPostResponse = {
    data?: {
        userWords: UserWords,
    },
    err?: string | null,
    msg?: string,
}
export async function POST(request: Request) {
    const body: GamesFlashcardPostRequest = await request.json();
    const response = await flashGameAction(body)
    return Response.json(response)
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