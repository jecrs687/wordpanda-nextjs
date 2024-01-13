import { createUser } from "@actions/User/createUser.action";
import prisma from "@infra/config/database";
import { MediaFactory } from "@mocks/factory/media";
import { PlatformFactory } from "@mocks/factory/platform";
import { UserFactory } from "@mocks/factory/user";
import { WordFactory } from "@mocks/factory/word";
import { Language, Word } from "@prisma/client";
import { randomInt } from "crypto";
import { LANGUAGES } from "./migration/languages";
const MOCK_SIZE = 30;
const RANDOM = 50
const insertRandomTranslation = async (lang: Language, skip: number, lang2: Language, word: Word) => {
    const randomWord = await prisma.word.findFirst({
        where: {
            languageId: lang2.id
        },
        skip
    })
    if (lang2.id !== lang.id) {
        await prisma.translation.create({
            data: {
                wordId: word.id,
                languageId: lang2.id,
                translations:
                {
                    connect: {
                        id: randomWord.id,
                        languageId: lang2.id,
                    }
                }

            }
        })
    }
}

const createLanguages = async () => {
    const filteredLanguages: {
        [key: string]: string
    } = LANGUAGES.reduce((a, c) => {
        if ([
            'en', 'it', 'pt'
        ].includes(c.code))
            a[c.code] = c.language;
        return a;
    }, {})
    const languages: { code: string, language: string }[] = Object.entries(filteredLanguages).map(([code, language]) => ({ code, language }))

    if (await prisma.language.count() == 0)
        await prisma.language.createMany({
            data: languages
        })

}
const createUsers = async () => {
    const userFactory = new UserFactory()

    const users = userFactory.createMany(MOCK_SIZE)
    if (await prisma.user.count() == 0)
        await prisma.user.createMany({
            data: users
        })
}
const createPlatforms = async () => {
    const platformFactory = new PlatformFactory();
    const platforms = platformFactory.createMany(MOCK_SIZE)
    if (await prisma.platform.count() == 0)
        await prisma.platform.createMany({
            data: platforms
        })
}

export async function migrateDatabase() {
    await createUsers()
    await createLanguages()
    await createPlatforms()
    await createUser({
        email: "demo@demo.it",
        firstName: "demo",
        lastName: "demo",
        password: "Demo123!",
        phone: "1234567890",
        username: "demo"
    })

    const wordFactory = new WordFactory();
    const mediaFactory = new MediaFactory();
    const languagesOnDb = await prisma.language.findMany({})

    if (await prisma.word.count() == 0)
        await Promise.all(
            languagesOnDb.map(
                async lang => {
                    const words = wordFactory.createMany(MOCK_SIZE * 10, {
                        languageId: lang.id
                    }).reduce((a, c) => {
                        if (!a.find(word => word.word === c.word)) {
                            a.push(c)
                        }
                        return a;
                    }, [])
                    await prisma.word.createMany({
                        data: words
                    })
                }
            )
        )


    if (await prisma.translation.count() == 0)
        await Promise.all(languagesOnDb.map(async lang => {
            const wordsOnDb = await prisma.word.findMany({
                where: {
                    languageId: lang.id
                }
            })
            for (const word of wordsOnDb) {
                for (const lang2 of languagesOnDb) {
                    if (Math.random() > RANDOM) continue;
                    if (Math.random() > RANDOM) await insertRandomTranslation(lang, randomInt(0, wordsOnDb.length), lang2, word)
                    await insertRandomTranslation(lang, randomInt(0, wordsOnDb.length), lang2, word)
                }
            }
        }))



    const languages = await prisma.language.findMany({})
    const users = await prisma.user.findMany({})
    if (await prisma.userLanguage.count() == 0)
        await Promise.all(
            users.map(async user => {
                for (const lang of languages) {
                    if (randomInt(0, 100) > RANDOM) continue;
                    await prisma.userLanguage.create({
                        data: {
                            userId: user.id,
                            languageId: lang.id
                        }
                    })
                }
            })
        )
    const userLanguageOnDb = await prisma.userLanguage.findMany({})
    if (await prisma.userWords.count() == 0)
        await Promise.all(userLanguageOnDb.map(
            async userLang => {
                const wordsOnDb = await prisma.word.findMany({
                    where: {
                        languageId: userLang.languageId
                    }
                })
                for (const word of wordsOnDb) {
                    if (randomInt(0, 100) > RANDOM) continue;
                    await prisma.userWords.create({
                        data: {
                            userId: userLang.id,
                            wordId: word.id,
                            userLanguageId: userLang.id
                        }
                    })
                }
            }
        ))
    const platformsOnDb = await prisma.platform.findMany({})

    if (await prisma.media.count() == 0)
        await Promise.all(platformsOnDb.map(async platform => {

            const media = mediaFactory.createMany(MOCK_SIZE, {
                platformId: platform.id,
            })

            await prisma.media.createMany({
                data: media
            });
        }))

    const mediaOnDb = await prisma.mediaLanguages.findMany({})
    if (await prisma.mediaLanguages.count() == 0)
        await Promise.all(mediaOnDb.map(async media => {
            const languages = await prisma.language.findMany({})
            for (const lang of languages) {
                if (randomInt(0, 100) > RANDOM) continue;
                await prisma.mediaLanguages.create({
                    data: {
                        mediaId: media.id,
                        languageId: lang.id,
                    }
                })
            }
        }))

    const mediaLanguagesOnDb = await prisma.mediaLanguages.findMany({})
    if (await prisma.mediaUser.count() == 0)
        await Promise.all(
            users.map(async user => {
                await prisma.mediaUser.createMany({
                    data: mediaLanguagesOnDb.filter(() => randomInt(1, 100) > RANDOM).map(media => ({
                        mediaId: media.id,
                        mediaLanguageId: media.id,
                        userId: user.id
                    }))
                })
            })
        )


    const mediaLanguages = await prisma.mediaLanguages.findMany({})
    if (await prisma.mediaWords.count() == 0)
        for (const medlang of mediaLanguages) {
            if (randomInt(0, 100) > RANDOM) continue;
            const words = await prisma.word.findMany({
                where: {
                    languageId: medlang.languageId
                }
            })
            await prisma.mediaWords.createMany({
                data: words.map(word => ({
                    mediaLanguageId: medlang.id,
                    wordId: word.id
                }))
            })
        }

}