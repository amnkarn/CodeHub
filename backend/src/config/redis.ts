import { createClient, type RedisClientType } from 'redis'
import 'dotenv/config'

const REDIS_DB_PASS = process.env.REDIS_DB_PASS;
if(!REDIS_DB_PASS) {
    throw new Error("REDIS_DB_PASS is missing");
}

export const redisClient: RedisClientType = createClient({
    username: 'default',
    password: REDIS_DB_PASS,
    socket: {
        host: 'redis-19424.c16.us-east-1-2.ec2.cloud.redislabs.com',
        port: 19424
    }
});
redisClient.on('error', err => console.log('Redis Client Error', err));


async function connectRedis() {
    try {
        if (!redisClient.isOpen) await redisClient.connect();
        console.log("Connected to Redis!");
    } catch (error) {
        console.log("Error in DB");
    }
}

connectRedis();

export default redisClient;