"use server";
import { TOKEN_KEY } from "@constants/CONFIGS";
import prisma from "@infra/config/database";
import { validateToken } from "@utils/token";
import { cookies, headers } from "next/headers";
export async function getLanguage({
    id, userId
}: {
    id: string,
    userId?: number
}) {
    const cookie = await cookies();
    const header = await headers();
    try {
        const token = cookie.get(TOKEN_KEY)?.value || header.get('Authorization');

        const { decoded: user } = validateToken(token);
        if (user == undefined) {
            return ({
                msg: "Token invalid",
                errors: "Token invalid",
            });
        }
        const languageFound = await prisma.language.findFirst({
            where: {
                id: +id,
            }
        });

        return {
            language: languageFound
        }

    } catch (err) {
        console.log({
            msg: "Error in getUserLanguages",
            errors: err,
        })
        return ({
            errors: err,
        });
    }
}