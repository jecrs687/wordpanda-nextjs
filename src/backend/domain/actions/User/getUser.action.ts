"use server";
import { cacheClient } from "@/src/backend/infra/cache/redis.cache";
import { TOKEN_KEY } from "@constants/CONFIGS";
import prisma from "@infra/config/database";
import { validateToken } from "@utils/token";
import { cookies, headers } from "next/headers";


export async function getUserInformation() {
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
        const cacheKey = `getUserInformation:${user.id}`;
        const cache = await cacheClient.get(cacheKey)
        if (cache) return { user: JSON.parse(cache) }
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
        cacheClient.set(cacheKey, JSON.stringify(userFound), { EX: 1000 });

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
        const cacheKey = `getUser:${user.id}`;
        const cache = await cacheClient.get(cacheKey)
        if (cache) return { user: JSON.parse(cache) }
        const userFound = await prisma.user.findFirst({
            where: {
                id: user.id
            },
            include: {
                language: true
            }
        });

        cacheClient.set(cacheKey, JSON.stringify(userFound), { EX: 1000 });
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