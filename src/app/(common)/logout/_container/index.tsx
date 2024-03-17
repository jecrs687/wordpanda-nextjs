"use client";

import { useChannels } from "@hooks/useChannels";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROUTES } from "src/containers/constants/ROUTES";
const deleteCookie = (name) => {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
export const Logout = async () => {
    const { popUp, web } = useChannels();
    const route = useRouter()
    useEffect(() => {
        deleteCookie('token')

        localStorage.clear()
        popUp.setToken('')
        web.setToken('')

        setTimeout(() => {
            route.push(ROUTES.LOGIN())
        }, 2000)

    }, [popUp, route, web])
    return (
        <div>Logout</div>
    );
}