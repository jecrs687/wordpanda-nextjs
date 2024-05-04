import fs from 'fs';
const route = "./src/backend/infra/cache/";
const OTPs = {
            get: () => JSON.parse(fs.readFileSync(route+'otp.json', 'utf8')),
            getItem: (key) => OTPs.get()[key],
            set: (key,value) => fs.writeFileSync(route+'otp.json', JSON.stringify({...OTPs.get(), [key]: value}), 'utf8'),
            delete: (key) => fs.writeFileSync(route+'otp.json', JSON.stringify(Object.fromEntries(Object.entries(OTPs.get()).filter(([k,v]) => k !== key))), 'utf8'),
            clear: () => fs.writeFileSync(route+'otp.json', '{}', 'utf8')
}

export const saveOtp = (email: string, otp: string) => {
    OTPs.set(email, otp);
    setTimeout(() => {
        OTPs.delete(email);
    }, 1000 * 60 * 60);
};

export const getOtp = (email: string) => {
    return OTPs.getItem(email);
};

export const deleteOtp = (email: string) => {
    OTPs.delete(email);
};

export const clearOtps = () => {
    OTPs.clear();
};

