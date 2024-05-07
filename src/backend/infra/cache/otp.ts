import { kv } from "@vercel/kv";
const OTPs = kv


export const saveOtp = (email: string, otp: string) => {
    OTPs.set(email, otp);
    setTimeout(() => {
        OTPs.del(email);
    }, 1000 * 60 * 60);
};

export const getOtp = async (email: string) => {
    return await OTPs.get(email);
};

export const deleteOtp = (email: string) => {
    OTPs.del(email);
};



