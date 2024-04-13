import { create } from "zustand";

const useWords = create<{
    words: { word: string }[],
    language: string,
    mediaId: number,
    insert: (words: { word: string }[], language: string, media?: number) => void,
}>()((set) => ({
    words: [],
    language: "english",
    mediaId: undefined,
    insert: (words: { word: string }[], language, mediaId) => set((state) => ({ words: words, language: language, mediaId })),
}));

export default useWords;