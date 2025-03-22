"use server";
import { sendEmail } from "@/src/backend/infra/mail";
import { TOKEN_KEY } from "@constants/CONFIGS";
import { getOtp, saveOtp } from "@infra/cache/otp";
import prisma from "@infra/config/database";
import { generateToken } from "@utils/token";
import { cookies } from "next/headers";


export async function resendOtp({ id }) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        });
        const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
        try {
            await saveOtp(id, randomOtp);
        } catch (cacheError) {
            console.error('Cache connection error:', cacheError);
            return { error: 'Failed to save OTP. Please check your Redis connection.' };
        }

        try {
            await sendEmail('WELCOME_MAIL', user, {
                otp: randomOtp
            })
        } catch (emailError) {
            console.error('Email sending error:', emailError);
            return { error: 'Failed to send email. Please check your email service configuration.' };
        }

        console.log('Resend OTP');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: error.message };
    }
}


export async function otpSubmit(currentState, form: FormData) {
    const otp = form.get('otp') as string;

    const id = form.get('id') as string;

    if (!otp) {
        return { errors: { otp: 'O campo é obrigatório' } };
    }
    if (otp.length !== 4) {
        return { errors: { otp: 'O campo deve conter 4 caracteres' } };
    }
    const otpCache = await getOtp(id);
    if (otp != otpCache) {
        return { errors: { otp: 'O código de verificação é inválido' } };
    }

    // deleteOtp(id);
    await prisma.user.update({
        where: {
            id
        },
        data: {
            activedAt: new Date()
        }
    });
    const user = await prisma.user.findUnique({
        where: {
            id
        }
    });

    if (!user) {
        return { errors: { otp: 'Usuário não encontrado' } };
    }

    const token = generateToken(user);
    if (!token) {
        return { errors: { otp: 'Erro ao gerar token' } };
    }
    if (token)
        (await cookies()).set(TOKEN_KEY, token)


    return { token };
}