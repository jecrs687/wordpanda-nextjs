import { Language } from "@prisma/client";
import { setCookie } from "@utils/cookie";
import { create } from "zustand";

const useLanguage = create<
    {
        language: number,
        select: (language: number) => void,
        languages: Language[],
        setLanguages: (languages: Language[]) => void,
    }
>((set) => ({
    language: -1,
    languages: [],
    select: (language) => set((state) => {
        if (typeof localStorage !== undefined)
            localStorage.setItem('language', language.toString());
        setCookie('language', language.toString());
        return { language: language }
    }),
    setLanguages: (languages) => set((state) => {
        if (typeof localStorage !== undefined)
            localStorage.setItem('languages', JSON.stringify(languages));
        return { languages: languages }
    }),
}));

export default useLanguage;