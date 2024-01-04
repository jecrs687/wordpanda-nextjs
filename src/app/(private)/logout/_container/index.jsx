"use client";

import { ROUTES } from "@constants/ROUTES";
import { redirect } from "next/navigation";

export const Logout = async () => {
    if (typeof window === 'undefined') return
    const cookieStore = window.cookieStore
    const cookies = await cookieStore.getAll()
    cookieStore.delete('token')
    redirect(ROUTES.LOGIN())
    return (
        <></>
    );
}