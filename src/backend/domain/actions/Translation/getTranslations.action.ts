import { cookies, headers } from "next/headers";
import { getUser } from "../User/getUser.action";

export const getTranslations = async () => {
    const cookie = await cookies();
    const header = await headers();
    const { user } = await getUser();
    const language = user?.language?.code || cookie.get('language') || header.get('Accept-Language') || 'en';
    const translations = await import(`@locales/${language?.split("-")?.[0]?.toLowerCase()}.json`);
    const recursive = (path: string) => {
        const keys = path.split(".");
        let value = translations;
        for (const key of keys) {
            value = value[key];
        }
        return value;
    }
    return { t: recursive };
}