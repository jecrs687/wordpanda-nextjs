"use client";
import { useEffect, useState } from "react";
import { useSWRConfig } from "swr";

export const SwrCacheProvider = () => {

    const [swrCache, setSWRCache] = useState<string>("{}");
    const { cache, mutate } = useSWRConfig();
    const setCache = (value: any) => {
        localStorage.setItem("swrcache", value);
        setSWRCache(value);
    }
    const parsedSWRCache = JSON.parse(swrCache) as object;
    useEffect(() => {
        const cacheStorage = localStorage.getItem("swrCache");
        if (!cacheStorage) return;
        setCache(cacheStorage)
    }, [])

    useEffect(() => {
        window?.addEventListener("beforeunload", () => {
            const newCache: any = {};

            // @ts-ignore
            for (const key of cache.keys()) {
                newCache[key] = cache.get(key);
            }

            setCache(JSON.stringify(newCache));
        });
    }, [
        cache
    ])
    useEffect(() => {
        if (!Object.keys(parsedSWRCache).length) return;
        Object.entries(parsedSWRCache).forEach(([key, value]) => {
            if (!value) return;
            cache.set(key, value);
        });

        // @ts-ignore
        for (const key of cache.keys()) {
            mutate(key);
        }

    }, [swrCache, cache, mutate, parsedSWRCache]);

    return <></>
};