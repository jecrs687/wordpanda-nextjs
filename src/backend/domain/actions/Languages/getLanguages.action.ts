"use server";
import prisma from "@infra/config/database";
export async function getLanguages() {
    try {

        const languagesFound = await prisma.language.findMany({
            include: {
                word: true,

                media: {
                    include: {
                        platform: true,
                        mediaWords: true,

                    },
                }
            }
        });

        return { languages: languagesFound }

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