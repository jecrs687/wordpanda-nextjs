"use server";
import { TOKEN_KEY } from "@constants/CONFIGS";
import { getOtp } from "@infra/cache/otp";
import prisma from "@infra/config/database";
import { generateToken } from "@utils/token";
import { cookies } from "next/headers";


export async function submit(currentState, form: FormData) {
    const otp = form.get('otp') as string;

    const id =  form.get('id') as string;

    if(!otp) {
        return { errors: { otp: 'O campo é obrigatório' } };
    }
    if(otp.length !== 4) {
        return { errors: { otp: 'O campo deve conter 4 caracteres' } };
    }
    const otpCache = getOtp(id);

    if(otp !== otpCache) {
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

    if(!user) {
        return { errors: { otp: 'Usuário não encontrado' } };
    }

    const token = generateToken(user);
    if(!token) {
        return { errors: { otp: 'Erro ao gerar token' } };
    }
    if (token) 
        cookies().set(TOKEN_KEY, token)
    
    
    return { token };
}