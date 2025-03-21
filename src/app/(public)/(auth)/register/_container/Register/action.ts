"use server";
import { createUser } from "@backend/domain/actions/User/createUser.action";
import prisma from "@infra/config/database";
import { sendEmail } from "@infra/mail";
import { retry } from "@utils/retry";
import { generateToken } from "@utils/token";
import z from "zod";
const schema = z.object({
    email: z.string().email("O email deve ser válido").min(6, "O email deve conter no mínimo 6 caracteres").max(100, "O email deve conter no máximo 100 caracteres"),
    //regex contains at least 1 uppercase letter, 1 lowercase letter, 1 number and a special character like: .!@#$%^&*
    password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres")
        .max(100,
            "A senha deve conter no máximo 100 caracteres"
        )
    // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d.!@#$%^&*˜"'-ˆ]{6,}$/,
    //     {
    //         message: "A senha deve conter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e um caractere especial"
    //     })
    ,
    firstName: z.string().min(2, "O primeiro nome deve conter no mínimo 2 caracteres").max(100, "O primeiro nome deve conter no máximo 100 caracteres"),
    lastName: z
        .string()
        .min(2, "O último nome deve conter no mínimo 2 caracteres")
        .max(100, "O último nome deve conter no máximo 100 caracteres"),
    passwordConfirmation: z
        .string()
        .min(6, "A confirmação de senha deve conter no mínimo 6 caracteres")
        .max(100, "A confirmação de senha deve conter no máximo 100 caracteres"),

    phone: z.string().min(6, "O telefone deve conter no mínimo 6 caracteres").max(100, "O telefone deve conter no máximo 100 caracteres"),
    username: z.string().min(4, "O username deve conter no mínimo 4 caracteres").max(100, "O username deve conter no máximo 100 caracteres"),
    languageId: z.number().int().min(1, "O idioma deve ser válido").max(100, "O idioma deve ser válido")
}).superRefine(({ passwordConfirmation, password }, ctx) => {
    if (passwordConfirmation !== password) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'A senha e a confirmação de senha devem ser iguais',
            path: ['passwordConfirmation']
        })
    }
});
export async function submit(currentState, form: FormData) {

    const forms = {
        email: form.get('email').toString().toLowerCase().trim(),
        password: form.get('password').toString(),
        firstName: form.get('firstName').toString(),
        lastName: form.get('lastName').toString(),
        phone: form.get('phone').toString(),
        passwordConfirmation: form.get('passwordConfirmation').toString(),
        username: form.get('username').toString().toLowerCase(),
        learningStyle: form.get('learningStyle').toString(),
        difficultyPreference: form.get('difficultyPreference'),
        preferredLearningTime: form.get('preferredLearningTime').toString(),
        dailyGoal: +form.get('dailyGoal'),
        languageId: +form.get('languageId')
    }
    const validate = schema.safeParse(forms) as typeof forms & { error: z.ZodError, success: boolean }

    const verifyEmail = await prisma.user.findFirst({
        where: {
            email: forms.email
        }
    });
    if (verifyEmail) {
        return {
            errors: {
                email: 'Email já cadastrado'
            }
        }
    }

    if (!validate.success && validate?.error) {
        const errors = validate?.error?.flatten()?.fieldErrors
        try {
            await prisma.probableUser.create({
                data: {
                    email: forms.email,
                }
            })
        } catch (error) {
            console.log({ error })
        }
        return ({ errors });
    }
    try {
        await prisma.probableUser.deleteMany({
            where: {
                email: forms.email
            }
        })
    } catch (error) {
        console.log({ error })
    }
    const { passwordConfirmation, ...rest } = forms;
    try {
        const response = await createUser({
            ...rest,
            dailyGoal: forms.dailyGoal || 0,
            preferredLearningTime: forms.preferredLearningTime || "",
            learningStyle: forms.learningStyle || "",
            difficultyPreference: +forms.difficultyPreference || 1,
            streak: 0,
            longestStreak: 0,
            totalPoints: 0,
            level: 0
        })
        if (response.errors) {
            return { success: false, errors: response.errors };
        }
        try {
            await retry(sendEmail('WELCOME_MAIL', response.user), 3)
            try {
                await retry(sendEmail('REPORT_MAIL', response.user, { to: 'emanuelcascone@gmail.com' }), 3)
            } catch (error) {
                console.log({ error })
            }
        }
        catch (error) {
            console.log({ error })
            await prisma.user.update({
                where: {
                    id: response.user.id
                },
                data: {
                    activedAt: new Date()
                }
            })
            return { token: generateToken(response.user) }
        }
        return { success: true, user: response.user };
    } catch (error) {
        console.log({ error })
        return { error: error.message }
    }
}