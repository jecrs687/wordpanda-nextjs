import { IInsertSubtitles, insertSubtitles } from "@backend/domain/actions/Subtitles/insertSubtitles";

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
    requests.push(body)
    if (requests.length < 20) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            insertSubtitles(requests);
            requests.length = 0;
        }, 1200)
    }
    return Response.json({ msg: 'OK' });
}

