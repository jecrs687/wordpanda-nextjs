"use client"
import { ROUTES } from "@constants/ROUTES"
import { getCookie } from "@utils/cookie"
import { useRouter } from "next/navigation"
import { useEffect } from "react"


export default function Page() {
    const router = useRouter()
    useEffect(() => {
        const token = getCookie('token')
        if (token) {
            router.push(ROUTES.DASHBOARD())
        } else {
            router.push(ROUTES.LOGIN())
        }
    }, [router])

    return <></>
}
