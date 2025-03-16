
export async function promisePoll<T, D = any>(fns: (value: T) => Promise<void | D>, values: T[], parallel: number, showLogs: Boolean = true) {
    const results: D[] = [];
    const errors = [];
    const initialSize = values.length;
    let promisePoll = 0;
    while (results.length + errors.length != initialSize) {
        if (promisePoll < parallel && !!values.length) {
            promisePoll++;
            const value = values.shift()
            fns(value).then((res: D) => {
                results.push(res);
                promisePoll--;
                if (showLogs)
                    console.log(`Finished ${results.length} of ${initialSize}`);
            }).catch(e => {
                errors.push(e);
                promisePoll--;
                console.log(`Error on ${results.length} of ${initialSize}:`, e);
            });
        }
        await new Promise((resolve) => setTimeout(resolve, 20));
    }
    return { results, errors };
};
