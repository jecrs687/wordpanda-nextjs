"use server";
import prisma from "@infra/config/database";
import { validateToken } from "@utils/token";
import { cookies, headers } from "next/headers";
export async function getLanguage({
    id, userId
}: {
    id: string,
    userId?: number
}) {
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
        const languageFound = await prisma.language.findFirst({
            where: {
                id: +id,
            },
            include: {
                words: {
                    orderBy: [
                        {
                            userWords: {
                                _count: 'desc'
                            }
                        },
                        {
                            frequency: 'desc'
                        }
                    ],
                    include: {
                        userWords: {
                            where: {
                                userId: +user.id
                            }
                        }
                    }
                },
                userLanguage: {
                    where: {
                        userId: +user.id
                    }
                }
            }
        });

        const words = languageFound.words.sort(
            ({ userWords, ...word }, { userWords: userWords2, ...word2 }) => {
                if (!userWords?.length)
                    return -1
                if (!userWords2?.length)
                    return 1
                if (userWords.length !== userWords2.length)
                    return userWords.length > userWords2.length ? 1 : -1
                if (userWords?.[0]?.errors / userWords?.[0]?.attempts !== userWords2?.[0]?.errors / userWords2?.[0]?.attempts)
                    return userWords?.[0]?.errors / userWords?.[0]?.attempts > userWords2?.[0]?.errors / userWords2?.[0]?.attempts ? -1 : 1
                if (userWords?.[0]?.lastSuccess !== userWords2?.[0]?.lastSuccess) return
                userWords?.[0]?.lastSuccess > userWords2?.[0]?.lastSuccess ? -1 : 1
                if (userWords?.[0]?.lastError !== userWords2?.[0]?.lastError)
                    return userWords?.[0]?.lastError > userWords2?.[0]?.lastError ? -1 : 1
                if (userWords?.[0]?.lastAttempt !== userWords2?.[0]?.lastAttempt)
                    return userWords?.[0]?.lastAttempt > userWords2?.[0]?.lastAttempt ? -1 : 1
                if (userWords?.[0]?.notLearned !== userWords2?.[0]?.notLearned)
                    return userWords?.[0]?.notLearned ? -1 : 1
                if (word.frequency !== word2.frequency)
                    return word.frequency > word2.frequency ? -1 : 1
                return 1
            }
        )
        return {
            languages: {
                ...languageFound,
                words
            }
        }

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