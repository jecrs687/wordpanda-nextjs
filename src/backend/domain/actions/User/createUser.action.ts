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
    phone: z.string().min(6).max(100),
    username: z.string().min(4).max(100),

});
type UserDto = Omit<User, 'updatedAt' | "createdAt" | "deletedAt" | "id" | "role" | "lastLoginAt" | "score">
export async function createUser(userDto: UserDto) {
    try {
        const validate = schema.safeParse(userDto) as typeof userDto & { error: z.ZodError, success: boolean }
        if (!validate.success && validate?.error) {
            return ({
                errors: validate?.error?.flatten()?.fieldErrors,
            });
        }
        userDto.password = encryptPassword(userDto.password)
        const inserted = await prisma.user.create({
            data: userDto
        })
        const token = generateToken(inserted);
        return { msg: 'ok', token }

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