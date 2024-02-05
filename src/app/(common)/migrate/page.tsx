import { createUser } from "@backend/domain/actions/User/createUser.action"
import { migrateLanguages } from "@infra/database/migration/languages"
import { subtitleMock } from "@infra/database/migration/subtitles"

export default async function Page() {
    //await migrateDatabase()
    await migrateLanguages()

    await createUser({
        email: "demo@demo.it",
        firstName: "demo",
        lastName: "demo",
        password: "Demo123!",
        phone: "1234567890",
        username: "demo",
        languageId: 606
    })
    await subtitleMock()

    // await createUser({
    //     email: "admin@admin.com",
    //     firstName: "Admin",
    //     lastName: "Admin",
    //     password: "Demo123!",
    //     phone: "1234567890",
    //     username: "Admin",
    //     languageId: 2
    // })
    // await migrateWords()
    return <></>
}