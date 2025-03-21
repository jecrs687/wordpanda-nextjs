"use server";
import { TOKEN_KEY } from "@constants/CONFIGS";
import prisma from "@infra/config/database";
import { validateToken } from "@utils/token";
import { cookies, headers } from "next/headers";
export async function getUserLanguages() {
    try {
        const token = (await cookies()).get(TOKEN_KEY)?.value || (await headers()).get('Authorization');
        const { decoded: { id } } = validateToken(token);
        const userLanguages = await prisma.userLanguage.findMany({
            where: {
                userId: id,
            },
            include: {
                language: {
                    include: {
                        _count: {
                            select: {
                                words: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        userWords: true
                    }
                }
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