export const chunkArray = (myArray: any[], chunk_size: number) => {
    const array = [...myArray];
    const results = [];
    while (array.length) {
        results.push(array.splice(0, chunk_size));
    }
    return results;
}