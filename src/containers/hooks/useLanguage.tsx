import { Language } from "@prisma/client";
import { create } from "zustand";

const useLanguage = create<
    {
        language: number,
        select: (language: number) => void,
        languages: Language[],
        setLanguages: (languages: Language[]) => void,
        targetLanguage: number,
        selectTargetLanguage: (language: number) => void
    }
>((set) => ({
    language: 59,
    targetLanguage: 6,
    languages: [],
    select: (language) => set((state) => ({ language: language })),
    selectTargetLanguage: (language) => set((state) => ({ targetLanguage: language })),
    setLanguages: (languages) => set((state) => ({ languages: languages }))
}));

export default useLanguage;