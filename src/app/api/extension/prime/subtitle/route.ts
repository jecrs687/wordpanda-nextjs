import { IInsertSubtitles, insertSubtitles } from "@backend/domain/actions/Subtitles/insertSubtitles";
import { deepcopy } from "@utils/deepcopy";
export type ExtensionPrimeSubtitlePostRequest = IInsertSubtitles
export type ExtensionPrimeSubtitlePostResponse = {
    err?: string | null,
    msg?: string
}
const requests = [];
let timeout;
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
    // const mocks = fs.readFileSync('./src/app/api/extension/prime/subtitle/mocks.json', 'utf-8',);
    // const mock = JSON.parse(mocks);
    // if (!mock.some(x => x.mediaId === body.mediaId))
    //     fs.writeFileSync('./src/app/api/extension/prime/subtitle/mocks.json', JSON.stringify([...mock, body], null, 2), 'utf-8');
    requests.push(body);
    if (requests.length < 20) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            insertSubtitles(deepcopy(requests));
            requests.length = 0;
        }, 60000)
    }
    return Response.json({ msg: 'OK' });
}

