import { getCookie } from "@utils/cookie";





export const fetchClient = (method: string) => async (
    url: string, options: Readonly<{
        arg: any;
    }>) => {
    const response: any = (await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getCookie('token') || localStorage.getItem('wordPand_token'),
            'language': getCookie('language') || localStorage.getItem('wordPand_language'),
            'Set-Cookie': `token=${getCookie('token') || localStorage.getItem('wordPand_token')}`
        },
        body: JSON.stringify(options?.arg)
    })).json()

    if (response?.err) {
        alert(response.err)
    }

    return response
}