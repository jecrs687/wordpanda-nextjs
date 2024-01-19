"use client";

import { ROUTES } from "@constants/ROUTES";
import { redirect } from "next/navigation";
import { useEffect } from "react";
const deleteCookie = (name) => {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
export const Logout = async () => {
    useEffect(() => {
        deleteCookie('token')
        setTimeout(() => {
            redirect(ROUTES.LOGIN())

        }, 200)

    }, [])
    return (
        <></>
    );
}