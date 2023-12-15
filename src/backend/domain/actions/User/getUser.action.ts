"use server";
import prisma from "@infra/config/database";
export async function getUser(id: number) {
    try {
        const userFound = await prisma.user.findFirst({
            where: {
                id
            }
        })
        return { user: userFound }

    } catch (err) {
        return ({
            errors: err,
        });
    }
}