"use server";
import prisma from "@infra/config/database";
import { comparePassword } from "@utils/encrypt";
import { generateToken } from "@utils/token";
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
                email: login.email
            }
        })

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
                createdAt: new Date(),
            }
        })
        const token = generateToken(userFound);
        return { token }

    } catch (err) {
        return ({
            errors: {
                error: JSON.stringify(err)
            },
        });
    }
}