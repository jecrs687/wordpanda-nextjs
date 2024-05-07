import { kv } from "@vercel/kv";
const OTPs = kv


export const saveOtp = async (email: string, otp: string) => {
    await OTPs.set(email, otp,{
        ex:60*60*1000
    });
};

export const getOtp = async (email: string) => {
    return await OTPs.get(email);
};

export const deleteOtp = (email: string) => {
    OTPs.del(email);
};



