import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai"
import dotenv from "dotenv"

dotenv.config()

const langchainEmbedding = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "models/gemini-embedding-001",
})
export const embedding = {
    generate:async(texts)=>{
        return await langchainEmbedding.embedDocuments(texts)
    }
}