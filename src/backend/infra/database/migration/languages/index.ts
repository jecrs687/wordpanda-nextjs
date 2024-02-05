import prisma from "@infra/config/database";
import { LANGUAGES } from './constants/LANGUAGES';

export const migrateLanguages = async () => {
    const filteredLanguages: {
        [key: string]: string
    } = LANGUAGES.reduce((a, c) => {
        a[c.code] = c.language;
        return a;
    }, {})
    const languages: { code: string, language: string }[] = Object.entries(filteredLanguages).map(([code, language]) => ({ code, language }))

    if (await prisma.language.count() == 0)
        await prisma.language.createMany({
            data: languages
        })

}