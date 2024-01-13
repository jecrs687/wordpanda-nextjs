import { IWord } from "./IWord"

export type IEventPrime = {
    words: IWord[],
    jsonFromTTML: {
        lang: string,
        version: string,
        subtitles: {
            moment: {
                begin: string,
                end: string,
            },
            text: string
            word: string
        }[]
    }
}