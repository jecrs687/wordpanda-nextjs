"use server";
import { loginUser } from "@backend/domain/actions/User/loginUser.action";
import { cookies } from "next/headers";

export async function submit(currentState, form: FormData) {
    "use server";
    const email = form.get('email');
    const password = form.get('password');
    const response = await loginUser({
        email: email as string,
        password: password as string
    })
    if (response?.token)
        cookies().set('token', response?.token)
    return response;
}