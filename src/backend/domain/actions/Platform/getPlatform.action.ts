"use server";
import prisma from "@infra/config/database";
type getPlatformsProps = {
    take?: number,
    skip?: number,
    search?: string

}
export async function getPlatforms(
    { take, skip, search }: getPlatformsProps = {}
) {
    try {
        const platformsFound = await prisma.platform.findMany({
            include: {
                medias: {
                    take: take ?? 200,
                    skip: skip ?? 0,
                    orderBy: {
                        mediaLanguages: {
                            _count: 'desc'
                        }
                    },
                    ...(search && {
                        where: {
                            name: {
                                contains: search,
                                mode: 'insensitive'
                            }
                        }
                    }),
                    include: {
                        mediaLanguages: {
                            include: {
                                _count: {
                                    select: {
                                        mediaUsers: true
                                    }
                                },
                                language: true,
                            }
                        },
                    }
                }
            }
        });

        return { platforms: platformsFound }

    } catch (err) {
        console.log({
            msg: "Error in getPlatforms",
            errors: err,
        })
        return ({
            errors: err,
        });
    }
}