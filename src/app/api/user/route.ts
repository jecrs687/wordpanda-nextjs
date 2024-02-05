// import { insertWords } from '@infra/database'
import { getUser } from '@backend/domain/actions/User/getUser.action'
export async function GET(request: Request) {
    return Response.json(
        await getUser()
    )
}

