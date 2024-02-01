import { createUser } from "@backend/domain/actions/User/createUser.action"
import { migrateLanguages } from "@infra/database/migration/languages"

export default async function Page() {
    // await migrateDatabase()
    await createUser({
        email: "demo@demo.it",
        firstName: "demo",
        lastName: "demo",
        password: "Demo123!",
        phone: "1234567890",
        username: "demo",
        languageId: 1
    })
    await migrateLanguages()
    // await migrateWords()
    return <></>
}