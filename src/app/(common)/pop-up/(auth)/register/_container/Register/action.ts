"use server";
import { createUser } from "@backend/domain/actions/User/createUser.action";
import { cookies, headers } from "next/headers";
import z from "zod";
const schema = z.object({
    email: z.string().email(),
    //regex contains at least 1 uppercase letter, 1 lowercase letter, 1 number and a special character like: .!@#$%^&*
    password: z.string().min(6).max(100).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d.!@#$%^&*]{6,}$/,
        {
            message: "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number"
        }),
    firstName: z.string().min(2).max(100),
    lastName: z.string().min(2).max(100),
    passwordConfirmation: z.string().min(6).max(100),
    phone: z.string().min(6).max(100),
    username: z.string().min(4).max(100),

}).superRefine(({ passwordConfirmation, password }, ctx) => {
    if (passwordConfirmation !== password) {
        ctx.addIssue({
            code: "custom",
            message: "The passwords did not match"
        });
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
        return ({
            errors: validate?.error?.flatten()?.fieldErrors,
        });
    }
    const { passwordConfirmation, ...rest } = forms;
    const languageId = 59 || +cookies().get('language')?.value || +headers().get('language')
    const response = await createUser({ ...rest, languageId })
    if (response?.token)
        cookies().set('token', response.token)
    return response;
}