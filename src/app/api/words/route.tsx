// import { insertWords } from '@infra/database'

import { getWords } from "@backend/domain/actions/Word/getWords.action";
import { Translation, UserWords, Word } from "@prisma/client";


export const config = {
    maxDuration: 60,
};




export type WordWithTranslations = Word & {
    translations?: Array<Translation & {
        translations: Word[]
    }>,
}
export type WordWithTranslationsAndUserWords = WordWithTranslations & {
    userWords: UserWords[]
}


export type WordsPostResponse = {
    data?: {
        wordsOnDb: Word[],
        words: WordWithTranslationsAndUserWords[],
        wordsNotOnDb: string[]
    },
    err?: string,
    msg?: string
}
export type WordsPostRequest = {
    words?: string[],
    language?: string,
    mediaId?: string,
    languageId?: number,
    limit?: number
}
export async function POST(request: Request) {
    const body: WordsPostRequest = await request.json();
    Response.json(await getWords(body))
}
