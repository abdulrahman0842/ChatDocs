import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai"
import chromaCollection from "../config/chroma.js"

// 1. Embedd Query
const EmbeddQuery = async (query) => {
    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY,
        model: "models/gemini-embedding-001",
    })

    const vector = await embeddings.embedQuery(query)
    return vector
}
// 2. Fetch related Documents
const fetchSimilarDocs = async (queryVector) => {
    const docs = await chromaCollection.query({ queryEmbeddings: queryVector })
    return docs
}
// 3. Prepare Context


export const dataRetrieval = async (query) => {
    try {
        const queryVector = await EmbeddQuery(query)
        const relatedDocs = await fetchSimilarDocs([queryVector])
        return relatedDocs
    } catch (error) {
        console.log('Error Fetching documents:=>', error);
    }
}