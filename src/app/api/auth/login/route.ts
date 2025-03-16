import { TOKEN_KEY } from "@constants/CONFIGS";
import prisma from "@infra/config/database";
import { generateToken } from "@utils/token";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    const body = await request.json();
    try {
        const user = prisma.user.findFirstOrThrow({
            where: {
                email: body.email,
                password: body.password
            }

        })
        const token = generateToken(user);
        (await cookies()).set(TOKEN_KEY, token)
        return Response.json({ user, token });
    }
    catch (err) {
        return Response.json({ err });
    }

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