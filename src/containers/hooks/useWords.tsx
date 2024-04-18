import { create } from "zustand";

const useWords = create<{
    words: { word: string }[],
    allWords: { [key: string]: { word: string }[] },
    language: string,
    mediaId: number,
    insert: (words: { word: string }[], language: string, media?: number) => void,
    setLanguage: (language: string) => void,
}>()((set) => ({
    words: [],
    allWords: {},
    language: "en-US",
    mediaId: undefined,
    insert: (words: { word: string }[], language, mediaId) => set((state) => ({ words: words, language: language, mediaId, allWords: { ...state.allWords, [language]: words } })),
    setLanguage: (language) => set((state) => ({ language, words: state.allWords[language] || [] })),
}));

export default useWords;