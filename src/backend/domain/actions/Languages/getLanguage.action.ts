"use server";
import prisma from "@infra/config/database";
import { validateToken } from "@utils/token";
import { cookies, headers } from "next/headers";
export async function getLanguage({
    id, userId
}: {
    id: string,
    userId?: number
}) {
    const cookie = cookies();
    const header = headers();
    try {
        const token = cookie.get('token')?.value || header.get('Authorization');

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