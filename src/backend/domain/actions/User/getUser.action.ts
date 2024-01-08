"use server";
import prisma from "@infra/config/database";
import { validateToken } from "@utils/token";
export async function getUser(token: string) {
    try {
        const { decoded: user } = validateToken(token);
        if (user == undefined) {
            return ({
                msg: "Token invalid",
                errors: "Token invalid",
            });
        }
        const userFound = await prisma.user.findFirst({
            where: {
                id: user.id
            },
            include: {
                UserWords: {
                    include: {
                        Words: true,
                        Language: true
                    }
                },
                MediaUser: {
                    include: {
                        Language: true,
                        Media: {
                            include: {
                                Platform: true,
                                mediaWords: true,
                            }
                        }
                    }
                },

            }
        });
        return { user: userFound }

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