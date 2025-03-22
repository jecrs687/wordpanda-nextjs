import { createClient } from 'redis';
export const cacheClient = await createClient({
    url: process.env.REDIS_URL
}).connect();