import { AppDataSource } from "../config/database";
import { Word } from "./entity/word.entity";
import { IWord } from "@view/interfaces/IWord";


export const insertWords = async (words: IWord[], lang: string) => {
    if (!AppDataSource.isInitialized)
        await AppDataSource.initialize()
    const wordsDto: Word[] = words.map((word: IWord) => {
        const wordToSave = new Word()
        wordToSave.word = word.word
        wordToSave.lang = 'en'
        return wordToSave
    }
    )
    await AppDataSource.manager.save(wordsDto)

    const word = await AppDataSource.manager.getId(wordsDto[0].id)
    console.log(word)
};
