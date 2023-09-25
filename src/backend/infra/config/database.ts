import {Client} from 'pg'
import knex, { Knex } from 'knex'
import { envs } from '@/utils/envs';
const configs:{development: Knex.Config, production: Knex.Config} = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: './langBoost.db',
        },
    },
    production: {
        client: 'pg',
        
        connection:{
        user: 'ixuuxognvdaoqr', 
        host: 'ec2-34-236-103-63.compute-1.amazonaws.com', 
        database: 'dan1oda28djbn1', 
        password: '7ff264b68621a580c9cd3d59891794455f9081244c0158b2c6a3e647355f7d3b', 
        port: 5432, 
        ssl:{
            rejectUnauthorized: false
        }
        }
    }
}
const selectedConfig: Knex.Config = configs[envs['NODE_ENV'] as 'development' | 'production'];

const client = knex(selectedConfig);
const connectDatabase = () => client
export {
    client,
    connectDatabase
}