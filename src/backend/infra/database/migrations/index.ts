import { Knex } from "knex";
import {client} from "@/backend/infra/config/database"
import fs from 'fs';

const getSQLFiles = ():string[] => {
    const SQLs:string[] = [];
    const dir = __dirname + "/sql";
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        if (file.endsWith(".sql")) {
            SQLs.push(file);
        }
    })
    const SQLTexts = SQLs.map((sql) => fs.readFileSync(dir + '/' + sql, "utf-8"));
    return SQLTexts;
};

const migration = {
    up: async function (knex: Knex) {
        const SQLsTexts = getSQLFiles();
        for(const SQLText of SQLsTexts)
            await knex.raw(SQLText);
        console.log("Migration done")
        return;
    },
    down: function (knex: Knex) {
        return knex.schema.dropTable("products").dropTable("users");
    },
    config: { transaction: false },
};

migration.up(client);

