import { ISubtitlePrime } from "@view/interfaces/ISubtitlePrime";
import { create } from "zustand";








const useEvents = create<{
    events: {
        PRIME: Array<ISubtitlePrime & { timestamp: number }>
    },
    insert: (name: string, event: any) => void,
}>()((set) => ({
    events: {
        PRIME: []
    },
    insert: (name, event) => set((state) => ({
        events: {
            ...state.events,
            [name]: [
                ...(state?.events?.[name] || []),
                {
                    ...event,
                    timestamp: new Date().getTime()
                }
            ]
        }
    })),
}));

export default useEvents;