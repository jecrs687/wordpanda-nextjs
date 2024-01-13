import { faker } from "@faker-js/faker";
import { Word } from "@prisma/client";

type WordFactoryProps = {
    word: string,
    difficulty: number,
    languageId: number
}
export class WordFactory {
    create(values: Partial<Word>): WordFactoryProps {
        return {
            word: faker.word.words({ count: 1 }),
            difficulty: faker.number.int({ min: 1, max: 100 }),
            languageId: 1,
            ...values
        }
    }
    createMany(size: number, values?: Partial<Word>): WordFactoryProps[] {
        return Array.from({ length: size }, () => this.create(values))
    }
}