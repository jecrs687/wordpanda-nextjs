"use server";
import { loginUser } from "@backend/domain/actions/User/loginUser.action";
import { TOKEN_KEY } from "@constants/CONFIGS";
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
        (await cookies()).set(TOKEN_KEY, response?.token)
    return response;
}