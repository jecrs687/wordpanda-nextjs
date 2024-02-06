"use client"
import { ROUTES } from "@constants/ROUTES"
import { validateToken } from "@utils/token"
import { useRouter } from "next/navigation"
import { useEffect } from "react"


export default function Page(
    {
        params, searchParams
    }
) {
    const router = useRouter()
    useEffect(() => {
        const token = localStorage.getItem('wordPand_token') || searchParams?.token
        const validated = validateToken(token)
        console.log({ token, validated })
        if (searchParams?.token) localStorage.setItem('wordPand_token', searchParams?.token)
        if (token) {
            router.push(ROUTES.EXTENSION_GAMES())
        } else {
            router.push(ROUTES.EXTENSION() + ROUTES.LOGIN())
        }
    }, [router, searchParams])

    return <></>
}
