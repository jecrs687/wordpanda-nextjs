import { IInsertSubtitles, insertSubtitles } from "@backend/domain/actions/Subtitles/insertSubtitles";
import { deepcopy } from "@utils/deepcopy";
import { promisePoll } from "@utils/promisePoll";
import { readFileSync, writeFileSync } from "fs";
export type ExtensionPrimeSubtitlePostRequest = IInsertSubtitles
export type ExtensionPrimeSubtitlePostResponse = {
    err?: string | null,
    msg?: string
}
const requests = [];
let timeout;
let flag = false;
async function processRequests() {
    if (flag) return;
    flag = true;
    let inc = 0;
    let err = 0;
    let onCache = 0;
    console.log(`Processing ${requests.length} requests`);
    await promisePoll<IInsertSubtitles>(async (x) => {
        const results = readFileSync('./src/app/api/extension/prime/subtitle/mocks1.json', 'utf-8',);
        const data = JSON.parse(results);
        if (data.some((y) => y.mediaId === x.mediaId)) {
            onCache++
            return;
        }
        const result = await insertSubtitles([deepcopy(x)])
        if (result.success) {
            inc++
            const results = readFileSync('./src/app/api/extension/prime/subtitle/mocks1.json', 'utf-8',);
            const data = JSON.parse(results);
            data.push(x);
            writeFileSync('./src/app/api/extension/prime/subtitle/mocks1.json', JSON.stringify(data, null, 2));

        } else {
            err++
        };
        console.log({
            success: result.success,
            totSuccess: inc,
            totError: err,
            onCache
        })
        return;
    }, requests, 1);
    console.log('Finished');
    flag = false;
    if (requests.length > 0) processRequests();
}



export async function POST(request: Request) {

    const body: ExtensionPrimeSubtitlePostRequest = await request.json();
    const { platform, links, name, image } = body;
    const validateImage = ["https://images-na.ssl-images-amazon.com", "https://m.media-amazon.com"]
    const validateLinks = "https://cf-timedtext.aux.pv-cdn.net"
    if (!platform || !links || !name || !image) {
        return Response.json({ err: 'Invalid data' });
    }
    if (!validateImage.some((x) => image.includes(x))) {
        return Response.json({ err: 'Invalid image' });
    }
    if (!links.every(link => link.url.includes(validateLinks))) {
        return Response.json({ err: 'Invalid links' });
    }
    const mocks = readFileSync('./src/app/api/extension/prime/subtitle/mocks.json', 'utf-8',);
    const data = JSON.parse(mocks);
    if (requests.length === 0)
        data.forEach((x) => requests.push(x))
    processRequests();

    return Response.json({ msg: 'OK' });
}

