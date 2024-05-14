
import { create } from "zustand";

const useQueryParams = create<{
    queryParams: Record<string, string>,
    setQueryParams: (queryParams: Record<string, string>) => void,
    getQueryParams: () => Record<string, string>,
    setQueryParamsFromUrl: () => void,
}>((set) => ({
    queryParams: {},
    setQueryParams: (queryParams) => set((state) => ({
        queryParams: {
            ...state.queryParams, ...queryParams
        }
    })),
    getQueryParams: () => {
        const searchParams = new URLSearchParams(window.location.search);
        const queryParams = {};
        for (const [key, value] of searchParams) {
            queryParams[key] = value;
        }
        return queryParams;
    },
    setQueryParamsFromUrl: () => {
        const searchParams = new URLSearchParams(window.location.search);
        const queryParams = {};
        for (const [key, value] of searchParams) {
            queryParams[key] = value;
        }
        set((state) => ({
            queryParams: {
                ...state.queryParams,
                ...queryParams,
            }
        }));
    },
}));

export default useQueryParams;