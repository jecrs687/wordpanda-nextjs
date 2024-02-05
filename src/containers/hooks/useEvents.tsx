import { IEventPrime } from "src/containers/view/interfaces/IEvents";
import { create } from "zustand";

const useEvents = create<{
    events: {
        [key: string]: any,
        words?: {
            [key: string]: IEventPrime
        },
    },
    insert: (name: string, event: any) => void,
    insertLanguage: (language: string, words: IEventPrime) => void,
}>()((set) => ({
    events: {
        words: {}
    },
    insert: (name, event) => set((state) => ({ events: { ...state.events, [name]: event } })),
    insertLanguage: (language, words) => set((state) => ({ events: { ...state.events, words: { ...state.events.words, [language]: words } } })),
}));

export default useEvents;