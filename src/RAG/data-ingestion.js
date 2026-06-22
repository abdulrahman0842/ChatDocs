import { Document } from "@langchain/core/documents";
import { PDFParse } from "pdf-parse";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai"

import { Chroma } from "@langchain/community/vectorstores/chroma";
import chromaCollection from "../config/chroma.js";

import { v4 as uuid4 } from "uuid"

// 1. Load PDF
const loadPdf = async (buffer) => {
    const parser = new PDFParse({ data: buffer, })
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
        chunkOverlap: 200
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

export const initDataIngestion = async (buffer, sessiondId) => {
    try {
        const docs = await loadPdf(buffer)

        const chunks = await chunkPdf(docs)

        const vectors = await EmbedChunk(chunks)

        let ids = []
        let metadatas = []

        for (let i = 1; i <= chunks.length; i++) {
            const id = `doc_${uuid4()}_${i}`
            const metadata = { sessiondId: sessiondId }
            ids.push(id)
            metadatas.push(metadata)

        }
        const chunks_text = chunks.map(chunk => chunk.pageContent)
        const response = await StoreVectors(ids, chunks_text, vectors)
        return response
    } catch (error) {
        console.log('Something went wrong ----', error);
    }


}