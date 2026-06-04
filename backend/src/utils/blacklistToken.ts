import redisClient from "../config/redis.js";


export default async function blackListToken(token: string, expiryInSeconds: number) {
    try {
        await redisClient.set(token, 'blacklisted', {
            EX: expiryInSeconds
        });       
    } catch (error) {
        console.log("Error in token blacklisting funtion", error)
    }
}