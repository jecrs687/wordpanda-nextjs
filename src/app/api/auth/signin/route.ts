import { createUser } from "@actions/User/createUser.action";


export async function POST(request: Request) {
    try {
        const response = await createUser(await request.json())
        return Response.json(response);
    } catch (err) {
        return Response.json({ err });
    }
}