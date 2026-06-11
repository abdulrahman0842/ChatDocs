import { Document } from "@langchain/core/documents";
import { PDFParse } from "pdf-parse";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai"

import { Chroma } from "@langchain/community/vectorstores/chroma";
import chromaCollection from "../config/chroma.js";

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
export const EmbedChunk = async (chunks) => {
    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY,
        model: "models/gemini-embedding-001",
    })

    const rawText = chunks.map(chunk => chunk.pageContent)
    const vector = await embeddings.embedDocuments(rawText)
    return vector
}
// 4. Storing in VectorDB
const StoreVectors = async (ids, docs, embeddings) => {
   const result = await chromaCollection.add({
        ids: ids,
        documents: docs,
        embeddings: embeddings
    })
    return result
}

export const initDataIngestion = async (filePath) => {
    try {
        const docs = await loadPdf(filePath)

        const chunks = await chunkPdf(docs)

        const vectors = await EmbedChunk(chunks)

        let ids = []

        for (let i = 1; i <= chunks.length; i++) {
            const id = `doc_${i + 1}`
            ids.push(id)
        }
        const chunks_text = chunks.map(chunk => chunk.pageContent)
        const response = await StoreVectors(ids, chunks_text, vectors)
        return response
    } catch (error) {
        console.log('Something went wrong ----', error);
    }


}