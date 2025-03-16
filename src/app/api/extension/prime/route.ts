import { IInsertSubtitles } from "@backend/domain/actions/Subtitles/insertSubtitles";
import { getWords } from "@backend/domain/actions/Word/getWords.action";
import { AmazonCatalog } from "@infra/clients/amazon/getCatalog";
import prisma from "@infra/config/database";
import { readFileSync } from "fs";
export type ExtensionPrimeSubtitlePostRequest = IInsertSubtitles
export type ExtensionPrimeSubtitlePostResponse = {
    err?: string | null,
    msg?: string
}
const requests = [];
let timeout;
let flag = false;
async function processRequests() {
    const results = readFileSync('./src/app/api/extension/prime/mock1.json', 'utf-8',);
    const data = JSON.parse(results) as AmazonCatalog;
    const value = data.containers.flatMap(x => x.entities)
    const prismaData = await prisma.media.findMany({
        where: {
            id: {
                in: value.map(x => x.titleID)
            }
        }
    });
    const dataOnDb = prismaData.map(x => x.id);

    await Promise.all(
        dataOnDb.map(async (x) => {
            try {
                const categorizedGenres = value.find(y => y.titleID === x).categorizedGenres
                const genres = [categorizedGenres.primaryGenre, ...categorizedGenres.secondaryGenres]
                const mediaLanguage = await prisma.mediaLanguages.findFirst({
                    where: {
                        mediaId: x,
                        language: {
                            code: {
                                startsWith: 'pt'
                            }
                        }
                    }
                })
                await prisma.mediaLanguages.update({
                    where: {
                        id: mediaLanguage.id
                    },
                    data: {
                        categories: genres
                    }
                })
            } catch (err) {
                console.log(`Error in ${x}`)
            }
        })
    )
    console.log(`Processing ${prismaData.length} requests`);

}



export async function GET(request: Request) {

    // processRequests();

    const movies = await prisma.media.findMany({})
    let limit = 200;
    for (const movie of movies) {
        limit += 10;
        console.log(`processing ${movie.name} - of ${movies.findIndex(x => x.id == movie.id)}/${movies.length}, limit: ${limit}`)

        await Promise.all(["en", "fr", "it", "es"].map(async (lang) => {
            await getWords({ language: lang, limit: limit, mediaId: movies[0].id })
        }))
    }
    return Response.json({ msg: 'OK' });
}

