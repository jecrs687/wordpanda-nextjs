import { Language } from "@prisma/client";
import { getCookie, setCookie } from "@utils/cookie";
import { create } from "zustand";

const useLanguage = create<
    {
        language: number,
        select: (language: number) => void,
        languages: Language[],
        setLanguages: (languages: Language[]) => void,
    }
>((set) => ({
    language: typeof localStorage !== undefined ? (+localStorage.getItem('language')) || (+getCookie('language')) || -1 : -1,
    languages: typeof localStorage !== undefined ? localStorage.getItem('languages') ? JSON.parse(localStorage.getItem('languages')) : [] : [],
    select: (language) => set((state) => {
        localStorage.setItem('language', language.toString());
        setCookie('language', language.toString());
        return { language: language }
    }),
    setLanguages: (languages) => set((state) => {
        localStorage.setItem('languages', JSON.stringify(languages));
        return { languages: languages }
    }),
}));

export default useLanguage;