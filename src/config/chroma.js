import { CloudClient } from "chromadb"
import dotenv from "dotenv"
import { embedding } from "./embedding.js"
dotenv.config()

const client = new CloudClient({
    apiKey: process.env.CHROMA_API_KEY
})

const chromaCollection = await   client.getOrCreateCollection({
    name: 'my-col2',
    embeddingFunction:embedding
})

export default chromaCollection