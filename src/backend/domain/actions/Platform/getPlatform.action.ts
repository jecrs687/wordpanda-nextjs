"use server";
import prisma from "@infra/config/database";
export async function getPlatforms() {
    try {
        const platformsFound = await prisma.platform.findMany({
            include: {
                medias: {
                    include: {
                        mediaLanguages: {
                            include: {
                                _count:{
                                    select:{
                                        mediaUsers:true
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