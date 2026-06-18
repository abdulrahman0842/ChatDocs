import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai"
import chromaCollection from "../config/chroma.js"
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts"
import { llm } from "../config/llm.js"
import dotenv from "dotenv"
dotenv.config()

// Embedd Query
const EmbeddQuery = async (query) => {
    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY,
        model: "models/gemini-embedding-001",
    })

    const vector = await embeddings.embedQuery(query)
    return vector
}
// Fetch related Documents
const fetchSimilarDocs = async (queryVector) => {
    const docs = await chromaCollection.query({ queryEmbeddings: queryVector })
    return docs
}

// Generate Condensed Query
const generateCondensedQuery = async (query, chatHistory) => {
    const prompt = ChatPromptTemplate.fromMessages(
        [
            "system",
            `Given a chat history and the latest user query, look for coreferences or dependencies. 
                If the latest query refers to context from the chat history, rephrase it into a standalone query that contains all the necessary background context. 
                This rephrased query will be used directly to search a vector database for relevant documents, so it must be clear and self-contained.`
        ],
        new MessagesPlaceholder('chatHistory'),
        [
            "system",
            `Do NOT answer the query.Just return the rephrased query or the original query if no rephrasing is needed.`
        ],
        [
            "human",
            `Latest User Query: { query }`
        ]
    )

    const chain = prompt.pipe(llm)
    const response = await chain.invoke({ query: query, chatHistory: chatHistory })
    return response.content

}

export const dataRetrieval = async (query, chatHistory) => {
    try {

        // 1. Generate Standalone query if it is not first query
        let condensedQuery = query
        if (chatHistory.length > 1) {
            const response = await generateCondensedQuery(query, chatHistory)
            condensedQuery = response
        }

        // 2. Create embedding of query
        const queryVector = await EmbeddQuery(condensedQuery)

        // 3. Search for similar documents in VectorDB
        const relatedDocs = await fetchSimilarDocs([queryVector])

        // 4. Return related documents
        return relatedDocs

    } catch (error) {
        console.log('Error Fetching documents:=>', error);
    }
}