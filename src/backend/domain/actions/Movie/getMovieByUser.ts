import prisma from "@infra/config/database";
import { validateToken } from "@utils/token";
import { cookies, headers } from "next/headers";

export const getMovieByUser = async (id: number) => {
    const token = cookies().get('token')?.value || headers().get('Authorization');
    if (!token) return { errors: 'Token not found' };
    const { decoded } = validateToken(token);
    if (!decoded) return { errors: 'Token invalid' };
    const userPromise = prisma.user.findFirst({
        where: {
            id: decoded.id
        }
    });
    const moviePromise = prisma.media.findFirst({
        where: {
            id: id
        },
        include: {
            mediaLanguages: {
                include: {
                    _count: {
                        select: {
                            mediaWords: true
                        }
                    },
                    language: true,

                    mediaWords: {
                        where: {
                            word: {
                                userWords: {
                                    some: {
                                        userId: decoded.id
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    const [user, movie] = await Promise.all([userPromise, moviePromise]);
    if (!user) return { errors: 'User not found' };
    if (!movie) return { errors: 'Movie not found' };

    return { movie, user };

}