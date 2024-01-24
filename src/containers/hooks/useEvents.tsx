import { eventMock } from "@mocks/databaseMock";
import { IEventPrime } from "src/containers/view/interfaces/IEvents";
import { create } from "zustand";

const useEvents = create<{
    events: {
        [key: string]: any,
        words?: IEventPrime | undefined,
    },
    insert: (name: string, event: any) => void,
}>()((set) => ({
    events: {
        words: eventMock
    },
    insert: (name, event) => set((state) => ({ events: { ...state.events, [name]: event } })),
}));

export default useEvents;