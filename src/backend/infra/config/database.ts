import { envs } from '@/utils/envs';
import "reflect-metadata"
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "./langBoost.db",
    entities: [],
    synchronize: true,
    logging: false,
})

AppDataSource.initialize();
