"use server";
import prisma from "@infra/config/database";
import { validateToken } from "@utils/token";
export async function getUserLanguages(token: string) {
    try {
        const { decoded: { id } } = validateToken(token);
        const userLanguages = await prisma.userLanguage.findMany({
            where: {
                userId: id,
            },
            include: {
                language: true,
                userWords: true,
            }
        });

        return { userLanguages: userLanguages }

    } catch (err) {
        console.log({
            msg: "Error in getUser",
            errors: err,
        })
        return ({
            errors: err,
        });
    }
}