"use server";
import prisma from "@infra/config/database";
import { validateToken } from "@utils/token";
import { cookies, headers } from "next/headers";

export async function getUser() {
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
        const userFound = await prisma.user.findFirst({
            where: {
                id: user.id
            },
            include: {
                userLanguages: {
                    include: {
                        _count: {
                            select: {
                                userWords: true
                            }
                        },
                        language: {
                            include: {
                                _count: {
                                    select: {
                                        words: true
                                    }
                                }
                            }
                        },
                    }
                },
                mediaUser: {
                    include: {
                        mediaLanguage: {
                            include: {
                                media: {
                                    include: {
                                        platform: true,
                                    }
                                },
                                language: true,
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