export const retry = async (fn: Promise<any>, retries = 3) => {
    try {
        return await fn;
    } catch (error) {
        if (retries > 0) {
            return await retry(fn, retries - 1);
        }
        throw error;
    }
}