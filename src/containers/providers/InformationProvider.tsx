'use client';

import { TOKEN_KEY } from "@constants/CONFIGS";
import useDevice from "@hooks/useDevice";
import { setCookie } from "@utils/cookie";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

function InformationProvider() {
    const searchParams = useSearchParams()

    const token = searchParams.get('token')
    const from = searchParams.get('from')

    const { setDevice, extension, mobile } = useDevice()
    useEffect(() => {
        if (from == 'extension') {
            setDevice('extension');
            setCookie('device', 'extension')
        }

        if (from == 'mobile') {
            setDevice('mobile');
            setCookie('device', 'mobile')
        }
        if (token)
            localStorage.setItem(TOKEN_KEY, token);
    }, [from, setDevice, token])

    return <></>
}
export default InformationProvider;