"use server";
import { createUser } from "@backend/domain/actions/User/createUser.action";
import prisma from "@infra/config/database";
import { sendEmail } from "@infra/mail";
import { retry } from "@utils/retry";
import { generateToken } from "@utils/token";
import z from "zod";

// We'll use generic error keys that can be translated on the client
const schema = z.object({
    email: z.string().email("register.validation.emailInvalid").min(6, "register.validation.emailTooShort").max(100, "register.validation.emailTooLong"),
    password: z.string().min(6, "register.validation.passwordTooShort")
        .max(100, "register.validation.passwordTooLong"),
    firstName: z.string().min(2, "register.validation.firstNameTooShort").max(100, "register.validation.firstNameTooLong"),
    lastName: z
        .string()
        .min(2, "register.validation.lastNameTooShort")
        .max(100, "register.validation.lastNameTooLong"),
    passwordConfirmation: z
        .string()
        .min(6, "register.validation.confirmPasswordTooShort")
        .max(100, "register.validation.confirmPasswordTooLong"),
    phone: z.string().min(6, "register.validation.phoneTooShort").max(100, "register.validation.phoneTooLong"),
    username: z.string().min(4, "register.validation.usernameTooShort").max(100, "register.validation.usernameTooLong"),
    languageId: z.number().int().min(1, "register.validation.invalidLanguage").max(100, "register.validation.invalidLanguage")
}).superRefine(({ passwordConfirmation, password }, ctx) => {
    if (passwordConfirmation !== password) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'register.validation.passwordsDoNotMatch',
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
                email: 'register.validation.emailAlreadyRegistered'
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