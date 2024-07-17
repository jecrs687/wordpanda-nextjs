
export async function promisePoll<T>(fns: (value: T) => Promise<void>, values: T[], parallel: number, showLogs: Boolean = true) {
    const results = [];
    let promisePoll = 0;
    while (!!values.length) {
        if (promisePoll < parallel) {
            promisePoll++;
            const value = values.shift()
            fns(value).then((res) => {
                results.push(res);
                promisePoll--;
                if (showLogs)
                    console.log(`Finished ${results.length} of ${values.length + results.length}`);
            });
        }
        await new Promise((resolve) => setTimeout(resolve, 50));
    }
    return results;
};
