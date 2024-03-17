"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Error = () => {


    const route = useRouter()
    useEffect(() => {
        // route.push(ROUTES.LOGOUT())
    }, [])
    return <h1>Error</h1>

}
export default Error;