import { Translation } from "@infra/database/entity/translation.entity";
import { User } from "@infra/database/entity/user.entity";
import { UserWords } from "@infra/database/entity/user_words.entity";
import { Word } from "@infra/database/entity/word.entity";
import "reflect-metadata"
import { DataSource } from "typeorm"

const AppDataSource = new DataSource({
    type: "better-sqlite3",
    database: "./langBoost.db",
    entities: [User, Word, UserWords, Translation],
    synchronize: true,
    logging: false,
})

export { AppDataSource }
