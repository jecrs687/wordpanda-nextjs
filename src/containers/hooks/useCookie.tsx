import { getCookie } from "@utils/cookie";

export const useCookie = (name: string | string[]) => {
    if (typeof window === 'undefined') return;
    if (Array.isArray(name)) return name.map((name) => getCookie(name));

    return getCookie(name);

}