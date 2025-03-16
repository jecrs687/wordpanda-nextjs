"use client";

import { TOKEN_KEY } from "@constants/CONFIGS";
import { useChannels } from "@hooks/useChannels";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "src/app/loading";
import { ROUTES } from "src/containers/constants/ROUTES";
const deleteCookie = (name) => {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
export const Logout = () => {
    const { popUp, web } = useChannels();
    const route = useRouter()
    useEffect(() => {
        deleteCookie(TOKEN_KEY)
        localStorage.clear()
        popUp.setToken('')
        web.setToken('')
        route.push(ROUTES.LOGIN())

    }, [popUp, route, web])
    return (
        <Loading />
    );
}