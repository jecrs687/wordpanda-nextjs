"use client";
import { TOKEN_KEY } from "@constants/CONFIGS";
import { ROUTES } from "@constants/ROUTES";
import { getCookie, setCookie } from "@utils/cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export function AuthenticationProvider({ redirect }) {
    const router = useRouter()

    useEffect(() => {
        const token = getCookie('token') || localStorage.getItem(TOKEN_KEY)
        if (token) {
            try {
                localStorage.setItem(TOKEN_KEY, token);
                setCookie('token', token);
            } catch (e) {
                console.log(e)
            }
        }
        if (!token) {
            router.push(redirect || ROUTES.LOGIN())
        }
    }, [router, redirect])

    return <></>
}