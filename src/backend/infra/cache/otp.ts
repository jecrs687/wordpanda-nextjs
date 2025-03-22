"use server";

import { cacheClient } from "./redis.cache";


export const saveOtp = async (id: string, otp: string) => {
    cacheClient.set(`otp-${id}`, otp, { EX: 60 });
};

export const getOtp = async (id: string) => {
    return cacheClient.get(`otp-${id}`);
};

export const deleteOtp = async (id: string) => {
    cacheClient.del(`otp-${id}`);
};



