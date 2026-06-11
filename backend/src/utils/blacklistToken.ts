import redisClient from "../config/redis.js";


export default async function blackListToken(token: string, expiryInSeconds: number) {
    try {
        await redisClient.set(token, 'blacklisted', {
            EX: expiryInSeconds
        });       
    } catch (error) {
        console.error("Error in token blacklisting function:", error);
        throw new Error("Failed to blacklist token");
    }
}