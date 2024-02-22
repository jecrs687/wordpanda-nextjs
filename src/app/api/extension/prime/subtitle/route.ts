import { insertSubtitles } from "@backend/domain/actions/Subtitles/insertSubtitles";

export type ExtensionPrimeSubtitlePostRequest = {
    platform: string, links: string[], name: string, image: string
}

export type ExtensionPrimeSubtitlePostResponse = {
    err?: string | null,
    msg?: string
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
    if (!links.every(link => link.includes(validateLinks))) {
        return Response.json({ err: 'Invalid links' });
    }
    insertSubtitles([{ platform, links, name, image }])
    return Response.json({ msg: 'OK' });


}

