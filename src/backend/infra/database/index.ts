import { IWords } from "@/backend/domain/database/words.interface";
import { client } from "../config/database";

export const getWords = async () => {
    const values = await client<IWords>("words").select("*");
    return values;
}

export const getWordsFromList = async (words: string[]) => {
    const values = await client<IWords>("words").select("*").whereIn("word", words);
    return values;
}
export const insertWords = async (words: string[]) => {
    const values = await client<IWords>("words").insert(words.map(word => ({ word })));
    return values;
} 