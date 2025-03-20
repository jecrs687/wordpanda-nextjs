"use server";
import prisma from "@infra/config/database";
import { Role } from "@prisma/client";
import { comparePassword } from "@utils/encrypt";
import { generateToken } from "@utils/token";
import { cookies } from "next/headers";
import z from "zod";
const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),

});
type LoginDto = z.infer<typeof schema>
export async function loginUser(login: LoginDto) {
    try {

        const validate = schema.safeParse(login) as { error: z.ZodError, success: boolean }
        if (!validate.success && validate?.error) {
            return ({
                errors: validate?.error?.flatten()?.fieldErrors,
            });
        }

        const userFound = await prisma.user.findFirst({
            where: {
                email: login.email.toLowerCase().trim()
            }
        })
        console.log(userFound)

        if (!userFound) {
            return ({
                errors: {
                    email: "Email not found"
                },
            });
        }
        const compared = comparePassword(login.password, userFound.password)
        if (!compared) {
            return ({
                errors: {
                    password: "Password is incorrect"
                },
            });
        }

        prisma.user.update({
            where: {
                id: userFound.id
            },
            data: {
                lastLoginAt: new Date(),
            }
        })
        try {
            if (userFound.role === Role.ADMIN)
                (await cookies()).set("admin", "true")
            else
                (await cookies()).delete("admin")
        }
        catch {
            console.log("Not possible set as admin in cookies")
        }
        const token = generateToken(userFound);
        if (userFound.activedAt === null) {
            return ({
                error: "USER_NOT_ACTIVATED",
                id: userFound.id
            });
        }
        return { token, admin: userFound.role === Role.ADMIN, user: userFound }

    } catch (err) {
        return ({
            errors: {
                error: JSON.stringify(err)
            },
        });
    }
}