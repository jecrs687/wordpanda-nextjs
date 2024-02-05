import prisma from "@infra/config/database";
import { validateToken } from "@utils/token";
import { cookies, headers } from "next/headers";

export const getMovieByUser = async (id: number) => {
    const token = cookies().get('token')?.value || headers().get('Authorization');
    if (!token) return { errors: 'Token not found' };
    const { decoded } = validateToken(token);
    if (!decoded) return { errors: 'Token invalid' };
    const user = await prisma.user.findFirst({
        where: {
            id: decoded.id
        }
    });
    if (!user) return { errors: 'User not found' };
    const movie = await prisma.media.findFirst({
        where: {
            id: id
        },
        include: {
            mediaLanguages: {
                include: {
                    language: true,
                    mediaWords: {
                        include: {
                            word: true
                        }
                    }
                }
            }
        }
    });
    if (!movie) return { errors: 'Movie not found' };
    const languagesByMediaByUser = await prisma.mediaUser.findMany({
        where: {
            userId: user.id,
            mediaLanguage: {
                media: {
                    id: id
                }
            }
        },
        include: {
            mediaLanguage: true
        },
    });
    const wordsByLanguagesByUser = await prisma.userWords.findMany({
        where: {
            userId: user.id,
            userLanguage: {
                languageId: {
                    in: languagesByMediaByUser.map(l => l.mediaLanguage.languageId)
                }
            }
        },
        include: {
            userLanguage: {
                include: {
                    language: true
                }
            },
            word: true
        }
    });

    const wordsByMediaByLanguage = movie.mediaLanguages.reduce(
        (acc: {
            [languageId: number]: number[]
        }, mediaLanguage) => {
            const words = mediaLanguage.mediaWords.map(mediaWord => mediaWord.wordId);
            acc[mediaLanguage.language.id] = words;
            return acc;
        }, {});
    const wordsByUserByMediaByLanguage = wordsByLanguagesByUser.reduce((acc: {
        [languageId: number]: number[]
    }, userWord) => {
        const words = userWord.userLanguage.languageId;
        if (!wordsByMediaByLanguage[words].includes(userWord.wordId)) return;
        if (!acc[words]) acc[words] = [];
        acc[words].push(userWord.wordId);
        return acc;
    }, {});



    return { movie, languagesByMediaByUser, user, wordsByUserByMediaByLanguage, wordsByMediaByLanguage };

}