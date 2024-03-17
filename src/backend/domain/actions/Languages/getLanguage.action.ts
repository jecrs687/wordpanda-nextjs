"use server";
import prisma from "@infra/config/database";
export async function getLanguage({
    id, userId
}: {
    id: string,
    userId?: number
}) {
    try {
        const languageFound = await prisma.language.findFirst({
            where: {
                id: +id
            },
            include: {
                word: true,
                userLanguage: {
                    where: {
                        userId
                    }
                }
            }
        });

        return { languages: languageFound }

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