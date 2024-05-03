"use client"
import { TOKEN_KEY } from "@constants/CONFIGS"
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
    if (searchParams?.movieId) router.push(ROUTES.EXTENSION() + ROUTES.MOVIE(searchParams?.movieId))
    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY) || searchParams?.token
        const validated = validateToken(token)
        if (searchParams?.token) localStorage.setItem(TOKEN_KEY, searchParams?.token)
        if (validated?.decoded) {
            router.push(ROUTES.EXTENSION_LANGUAGES())
        } else {
            router.push(ROUTES.EXTENSION() + ROUTES.LOGIN())
        }
    }, [router, searchParams])

    return <></>
}
