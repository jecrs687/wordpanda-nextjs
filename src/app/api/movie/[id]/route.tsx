import { getMovieByUser } from "@backend/domain/actions/Movie/getMovieByUser";
import { TOKEN_KEY } from "@constants/CONFIGS";
import { cookies, headers } from "next/headers";
import { NextRequest } from "next/server";


export type MovieIdGetRequest = {}

export type MovieIdGetResponse = {
    data?: Awaited<ReturnType<typeof getMovieByUser>>,
    err?: string | null,
    msg?: string,
}
export async function GET(request: NextRequest, ...rest) {
    const token = (await cookies())?.get(TOKEN_KEY)?.value || (await headers()).get('Authorization')

    const response: MovieIdGetResponse = {
        err: null,
        msg: 'Quiz generated'

    }
    return Response.json(response)
}