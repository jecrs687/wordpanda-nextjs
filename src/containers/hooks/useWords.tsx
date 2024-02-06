import { create } from "zustand";

const useWords = create<{
    words: { word: string }[],
    language: string,
    media: number,
    insert: (words: { word: string }[], language: string, media?: number) => void,
}>()((set) => ({
    words: [],
    language: "english",
    media: undefined,
    insert: (words: { word: string }[], language, media) => set((state) => ({ words: words, language: language, media })),
}));

export default useWords;