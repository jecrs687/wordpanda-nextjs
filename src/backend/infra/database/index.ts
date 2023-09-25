import { IWords } from "@/backend/domain/database/words.interface";
import { client } from "../config/database";
import { randomUUID } from "crypto";

export const getWords = async () => {
    const values = await client<IWords>("words").select("*");
    return values;
}

export const getWordsFromList = async (words: string[]) => {
    const values = await client<IWords>("words").select("*").whereIn("word", words);
    return values;
}
export const insertWords = async (words: string[], lang: string) => {
    try {
        const split: string[][] = words.reduce(
            (acc: string[][], word: string) =>
                acc[acc.length - 1].length < 10 ? [...acc.slice(0, -1), [...acc[acc.length - 1], word]] : [...acc, [word]],
            [[]] as string[][]
        );
        const values = await Promise.all(
            split.map(async (words) => {
            const values = await client<IWords>("words").insert(words.map(word => ({ word, lang, created_at: new Date(), word_id: randomUUID()})));
            return values;
        }))
    } catch (e) {
        console.log(e);
        return e;
    }
};
