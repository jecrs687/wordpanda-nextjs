"use server";
import prisma from "@infra/config/database";
export async function getLanguages() {
    try {
        const languagesFound = await prisma.language.findMany({
            include: {
                _count: {
                    select: {
                        words: true
                    }
                },
            }
        });

        return { languages: languagesFound }

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