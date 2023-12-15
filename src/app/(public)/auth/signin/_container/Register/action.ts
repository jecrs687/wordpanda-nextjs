"use server";
import { createUser } from "@backend/domain/actions/User/createUser.action";
import { cookies } from "next/headers";


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
    const response = await createUser(forms)
    if (response?.token)
        cookies().set('token', response.token)
    return response;
}