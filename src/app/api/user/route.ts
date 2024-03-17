// import { insertWords } from '@infra/database'
import { getUserWithWords } from '@backend/domain/actions/User/getUserWithWords.action'

export async function GET(request: Request) {
    const user = await getUserWithWords()

    return Response.json(
        user
    )
}

