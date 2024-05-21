"use server";

import prisma from "@infra/config/database";
import { validateToken } from "@utils/token";

export async function deleteUser({ token }) {
    const { decoded } = validateToken(token);
    const id = decoded.id;
    const deletedUser = await prisma.user.delete({
        where: {
            id
        },
        include: {
            language: true,
            mediaUser: true,
            userLanguages: true,
            UserWords: true
        }
    })
    return deletedUser;
}