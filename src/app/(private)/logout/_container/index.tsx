"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";
import { ROUTES } from "src/containers/constants/ROUTES";
const deleteCookie = (name) => {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
export const Logout = async () => {
    useEffect(() => {
        deleteCookie('token')
        localStorage.clear()
        setTimeout(() => {
            redirect(ROUTES.LOGIN())

        }, 200)

    }, [])
    return (
        <></>
    );
}