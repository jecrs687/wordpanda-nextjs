"use client"
import { ROUTES } from "@constants/ROUTES"
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
        console.log({ token })
        if (searchParams?.token) localStorage.setItem('wordPand_token', searchParams?.token)
        if (token) {
            router.push(ROUTES.EXTENSION_GAMES())
        } else {
            router.push(ROUTES.EXTENSION() + ROUTES.LOGIN())
        }
    }, [router, searchParams])

    return <></>
}
