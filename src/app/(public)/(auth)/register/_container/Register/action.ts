"use server";
import { createUser } from "@backend/domain/actions/User/createUser.action";
import { sendEmail } from "@infra/mail";
import { cookies, headers } from "next/headers";
import z from "zod";
const schema = z.object({
    email: z.string().email("O email deve ser válido").min(6, "O email deve conter no mínimo 6 caracteres").max(100, "O email deve conter no máximo 100 caracteres"),
    //regex contains at least 1 uppercase letter, 1 lowercase letter, 1 number and a special character like: .!@#$%^&*
    password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres")
        .max(100,
            "A senha deve conter no máximo 100 caracteres"
        ).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d.!@#$%^&*]{6,}$/,
            {
                message: "A senha deve conter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e um caractere especial"
            }),
    firstName: z.string().min(2, "O primeiro nome deve conter no mínimo 2 caracteres").max(100, "O primeiro nome deve conter no máximo 100 caracteres"),
    lastName: z.string().min(2, "O último nome deve conter no mínimo 2 caracteres").max(100, "O último nome deve conter no máximo 100 caracteres"),
    passwordConfirmation: z.string().min(6, "A confirmação de senha deve conter no mínimo 6 caracteres").max(100, "A confirmação de senha deve conter no máximo 100 caracteres"),
    phone: z.string().min(6, "O telefone deve conter no mínimo 6 caracteres").max(100, "O telefone deve conter no máximo 100 caracteres"),
    username: z.string().min(4, "O username deve conter no mínimo 4 caracteres").max(100, "O username deve conter no máximo 100 caracteres")

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
        email: form.get('email') as string,
        password: form.get('password') as string,
        firstName: form.get('firstName') as string,
        lastName: form.get('lastName') as string,
        phone: form.get('phone') as string,
        passwordConfirmation: form.get('passwordConfirmation') as string,
        username: form.get('username') as string
    }
    const validate = schema.safeParse(forms) as typeof forms & { error: z.ZodError, success: boolean }
    if (!validate.success && validate?.error) {
        const errors = validate?.error?.flatten()?.fieldErrors
        return ({ errors });
    }
    const { passwordConfirmation, ...rest } = forms;
    const languageId = 59 || +cookies().get('language')?.value || +headers().get('language')
    const response = await createUser(rest)
    sendEmail('WELCOME_MAIL', response.user)
    if (response?.token)
        cookies().set('token', response.token)
    return response;
}