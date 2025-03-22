"use server";
import prisma from "@infra/config/database";
import { getUser } from "../User/getUser.action";
export async function getLanguages() {
    try {
        const languagesFound = await prisma.language.findMany({
            include: {
                _count: {
                    select: {
                        words: true,
                        mediaLanguages: true,
                        userLanguage: true,
                        user: true,
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

export async function setUserLanguage({ id }) {
    const { user } = await getUser();
    if (!user) {
        return {
            errors: "User not found",
        }
    }
    try {
        const userUpdated = await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                languageId: id,
            },
        })

        return { userUpdated }


    } catch (err) {
        console.log({
            msg: "Error in putLanguage",
            errors: err,
        })
        return ({
            errors: err,
        });
    }
}