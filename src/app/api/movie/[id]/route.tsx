import { getMovieByUser } from "@backend/domain/actions/Movie/getMovieByUser";
import { cookies, headers } from "next/headers";
import { NextRequest } from "next/server";


export type MovieIdGetRequest = {}

export type MovieIdGetResponse = {
    data?: Awaited<ReturnType<typeof getMovieByUser>>,
    err?: string | null,
    msg?: string,
}
export async function GET(request: NextRequest, ...rest) {
    const token = cookies()?.get('token')?.value || headers().get('Authorization')

    const response: MovieIdGetResponse = {
        err: null,
        msg: 'Quiz generated'

    }
    return Response.json(response)
}