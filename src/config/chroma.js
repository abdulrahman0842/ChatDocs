import { CloudClient } from "chromadb"

const client = new CloudClient({
    apiKey: process.env.CHROMA_API_KEY
})

const chromaCollection = await   client.getOrCreateCollection({
    name: 'my-col2'
})

export default chromaCollection