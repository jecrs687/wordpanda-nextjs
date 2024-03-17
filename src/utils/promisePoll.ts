import { chunkArray } from "./chunkarray";

export const PromisePoll = async (fns: Promise<any>[], interval: number, parallel: number) => {
    const results = [];
    const promises = chunkArray(fns, parallel);
    for (const promise of promises) {
        const result = await Promise.all(promise);
        results.push(result);
        await new Promise((resolve) => setTimeout(resolve, interval));
    }
    return results;
};