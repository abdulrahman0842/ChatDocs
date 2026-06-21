import { Redis } from "@upstash/redis";
import dotenv from "dotenv"
dotenv.config()

export const redisClient = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN
})

export const insertChatMessage = async (role, message, redisKey) => {
    try {
        const msg = { role: (role != "user" ? "assistant" : "user"), message: message, }
        await redisClient.rpush(redisKey, msg)
    } catch (error) {
        console.log(`Error inserting Message in Redis.=>${error}`)
    }
}