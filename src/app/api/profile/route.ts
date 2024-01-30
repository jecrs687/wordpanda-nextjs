import prisma from "@infra/config/database";
import { User } from "@prisma/client";
import { validateToken } from "@utils/token";
import { cookies } from "next/headers";
import z from 'zod';


export type ProfilePutRequest = {
    email: string;
    password: string;
    phone: string;
    firstName: string;
    lastName: string;
    languageId: number;
}

export type ProfilePutResponse = {
    data: User,
    err: string | null,
    msg: string
}
export async function PUT(request: Request) {
    try {
        const {
            email,
            password,
            phone,
            firstName,
            lastName,
            languageId
        }: ProfilePutRequest = await request.json();

        const token = cookies().get('token');
        if (!token.value) {
            return Response.json({
                err: 'Unauthorized',
                msg: 'NOT_AUTHORIZED'
            })
        }
        const { decoded } = validateToken(token.value);
        const verify = z.object({
            email: z.string().email(),
            password: z.string().min(8, 'Password must be at least 8 characters')
                .or(z.string().optional()),
            phone: z.string().min(10),
            firstName: z.string(),
            lastName: z.string(),
            languageId: z.number().int()
        }).safeParse({
            email,
            ...(password && { password }),
            phone,
            firstName,
            lastName,
            languageId
        }) as { success: boolean, data: ProfilePutRequest }
        if (!verify.success) {
            return Response.json({
                err: 'Bad Request',
                msg: 'BAD_REQUEST'
            })
        }
        const { success, data } = verify
        const user = await prisma.user.update({
            where: {
                id: decoded.id
            },
            data
        })
        const response: ProfilePutResponse = {
            data: user,
            err: null,
            msg: 'OK'
        }
        return Response.json(response)
    }
    catch (err) {
        return Response.json({
            err: 'Internal Server Error',
            msg: 'INTERNAL_SERVER_ERROR',
            longError: err
        })
    }

}



export type ProfileGetResponse = {
    data: User,
    err: string | null,
    msg: string
}
export async function GET(request: Request) {
    try {
        const token = cookies().get('token');
        if (!token.value) {
            return Response.json({
                err: 'Unauthorized',
                msg: 'NOT_AUTHORIZED'
            })
        }
        const { decoded } = validateToken(token.value);
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id
            }
        })
        if (!user) {
            return Response.json({
                err: 'Unauthorized',
                msg: 'NOT_AUTHORIZED'
            })
        }
        const response: ProfileGetResponse = {
            data: user,
            err: null,
            msg: 'OK'
        }
        return Response.json(response)
    }
    catch (err) {
        return Response.json({
            err: 'Internal Server Error',
            msg: 'INTERNAL_SERVER_ERROR',
            longError: err
        })
    }
}
