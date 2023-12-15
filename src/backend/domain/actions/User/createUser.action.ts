"use server";
import prisma from "@infra/config/database";
import { User } from "@prisma/client";
import { encryptPassword } from "@utils/encrypt";
import { generateToken } from "@utils/token";
import z from "zod";
const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
    firstName: z.string().min(2).max(100),
    lastName: z.string().min(2).max(100),
    passwordConfirmation: z.string().min(6).max(100),
    phone: z.string().min(6).max(100),
    username: z.string().min(6).max(100),

}).superRefine(({ passwordConfirmation, password }, ctx) => {
    if (passwordConfirmation !== password) {
        ctx.addIssue({
            code: "custom",
            message: "The passwords did not match"
        });
    }
});
type UserDto = Omit<User, 'updatedAt' | "createdAt" | "deletedAt" | "id" | "role">
export async function createUser(userDto: UserDto & { passwordConfirmation: string }) {
    try {
        const validate = schema.safeParse(userDto) as typeof userDto & { error: z.ZodError, success: boolean }
        if (!validate.success && validate?.error) {
            return ({
                errors: validate?.error?.flatten()?.fieldErrors,
            });
        }
        userDto.password = encryptPassword(userDto.password)
        const { passwordConfirmation, ...user } = userDto
        const inserted = await prisma.user.create({
            data: user
        })
        const token = generateToken(inserted);
        return token

    } catch (err) {
        if (err?.code === 'P2002') {
            return ({
                errors: {
                    email: "Email already exists"
                },
            });
        }
        return ({
            errors: {
                error: JSON.stringify(err)
            },
        });
    }
}