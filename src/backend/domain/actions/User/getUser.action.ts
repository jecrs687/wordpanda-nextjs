"use server";
import { TOKEN_KEY } from "@constants/CONFIGS";
import prisma from "@infra/config/database";
import { validateToken } from "@utils/token";
import { cookies, headers } from "next/headers";

const cache = new Map();
export async function getUser() {
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
        if (cache.has(user.id)) {
            return { user: cache.get(user.id) }
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

            },

        });
        cache.set(user.id, userFound);
        setTimeout(() => {
            cache.delete(user.id);
        }, 1000 * 60 * 60 * 24);
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