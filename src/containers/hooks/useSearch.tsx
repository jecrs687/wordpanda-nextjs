import { create } from "zustand";

const useSearch = create<
    {
        search: string,
        setSearch: (search: string) => void,
    }>((set) => ({
        search: '',
        setSearch: (search: string) => set({ search }),

    }));

export default useSearch;