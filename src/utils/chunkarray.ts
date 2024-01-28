export const chunkArray = (myArray: any[], chunk_size: number) => {
    var results = [];
    while (myArray.length) {
        results.push(myArray.splice(0, chunk_size));
    }
    return results;
}