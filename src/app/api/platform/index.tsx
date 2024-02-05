// import { insertWords } from '@infra/database'
import { getPlatforms } from '@backend/domain/actions/Platform/getPlatform.action'
export async function GET(request: Request) {
    return Response.json(
        await getPlatforms()
    )
}

