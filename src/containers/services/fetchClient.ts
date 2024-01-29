import { getCookie } from "@utils/cookie";





export const fetchClient = (method: string) => async (
    url: string, options: Readonly<{
        arg: any;
    }>) => {
    const response: any = (await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getCookie('token')
        },
        body: JSON.stringify(options?.arg)
    })).json()

    if (response?.err) {
        alert(response.err)
    }

    return response
}