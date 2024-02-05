"use server";
import { loginUser } from "@backend/domain/actions/User/loginUser.action";

export async function submit(currentState, form: FormData) {
    "use server";
    const email = form.get('email');
    const password = form.get('password');
    const response = await loginUser({
        email: email as string,
        password: password as string
    })
    return response;
}