import { Document } from "@langchain/core/documents";
import { PDFParse } from "pdf-parse";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai"
// 1. Load PDF
const loadPdf = async (filePath) => {
    const parser = new PDFParse({ url: filePath, })
    const data = await parser.getText()
    return new Document(
        {
            pageContent: data.text,
            metadata: {
                source: filePath
            }
        }
    )
}
// 2. Chunking
const chunkPdf = async (document) => {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverLap: 200
    })

    const chunks = splitter.splitDocuments([document])
    return chunks
}
// 3. Embedding
const EmbedChunk = async (chunks) => {
    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY,
        model: "models/gemini-embedding-004",
    })
    const rawText = chunks.map(chunk => chunk.pageContent)
    console.log(rawText.length);
    
    const vector = await embeddings.embedDocuments(rawText)
    return vector
}
// 4. Storing in VectorDB


export const initDataIngestion = async (filePath) => {
    const docs = await loadPdf(filePath)

    const chunks = await chunkPdf(docs)

    const vectors = await EmbedChunk(chunks)
    console.log(vectors[0])
}