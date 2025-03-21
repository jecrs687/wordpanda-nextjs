"use client"
import { TOKEN_KEY } from "@constants/CONFIGS"
import { ROUTES } from "@constants/ROUTES"
import { validateToken } from "@utils/token"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"


export default function Page() {
    const searchParams = useSearchParams()
    const router = useRouter()
    if (searchParams.get("movieId")) router.push(ROUTES.EXTENSION() + ROUTES.MOVIE(searchParams?.get("movieId")))
    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY) || searchParams?.get("token")
        const validated = validateToken(token)
        if (searchParams?.get("token")) localStorage.setItem(TOKEN_KEY, searchParams?.get("token"))
        if (validated?.decoded) {
            router.push(ROUTES.EXTENSION_LANGUAGES())
        } else {
            router.push(ROUTES.EXTENSION() + ROUTES.LOGIN())
        }
    }, [router, searchParams])

    return <></>
}
