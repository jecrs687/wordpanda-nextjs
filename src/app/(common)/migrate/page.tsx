import { migrateDatabase } from "@infra/database"

export default async function Page() {
    await migrateDatabase()
    return <></>
}