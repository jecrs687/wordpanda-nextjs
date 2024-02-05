'use client';

import useDevice from "@hooks/useDevice";
import { useSearchParams } from "next/navigation";

function InformationProvider() {
    const searchParams = useSearchParams()

    const token = searchParams.get('token')
    const from = searchParams.get('from')

    const { setDevice, extension, mobile } = useDevice()

    if (from == 'extension' && !extension)
        setDevice('extension')

    if (from == 'mobile' && !mobile)
        setDevice('mobile')
    if (typeof window === 'undefined') return <></>
    if (token)
        localStorage.setItem('wordPand_token', token);
    return <></>
}
export default InformationProvider;