import { createUser } from "@backend/domain/actions/User/createUser.action"
import { migrateLanguages } from "@infra/database/migration/languages"
import { migrateWords } from "@infra/database/migration/words"

export default async function Page() {
    // await migrateDatabase()
    await createUser({
        email: "demo@demo.it",
        firstName: "demo",
        lastName: "demo",
        password: "Demo123!",
        phone: "1234567890",
        username: "demo"
    })
    await migrateLanguages()
    await migrateWords()
    return <></>
}