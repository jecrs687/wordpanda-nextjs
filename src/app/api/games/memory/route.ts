import { memoryGameAction } from "@backend/domain/actions/Games/memory.action";
import { UserWords } from "@prisma/client";



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
    return Response.json(await memoryGameAction(body));

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