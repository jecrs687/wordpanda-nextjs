"use server";

import { TOKEN_KEY } from "@constants/CONFIGS";
import prisma from "@infra/config/database";
import { validateToken } from "@utils/token";
import { cookies } from "next/headers";

type InsertMissingMovies = {
    name: string;
    provider: string;
}

export async function insertMissingMovies(forms: FormData) {
    const cookie = cookies()
    const form: InsertMissingMovies = {
        name: forms.get('name') as string,
        provider: forms.get('provider') as string
    }
    const { name, provider } = form
    const { decoded } = validateToken(cookie.get(TOKEN_KEY).value)
    await prisma.missingMedia.create({
        data: {
            name,
            provider,
            user: {
                connect: {
                    id: decoded.id
                }
            }

        }
    })
}