import { Document } from "@langchain/core/documents";
import { PDFParse } from "pdf-parse";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai"

import chromaCollection from "../config/chroma.js";

import { v4 as uuid4 } from "uuid"

import { embedding } from "../config/embedding.js";
// 1. Load PDF
const loadPdf = async (buffer) => {
    const parser = new PDFParse({ data: buffer, })
    const data = await parser.getText()
    return new Document(
        {
            pageContent: data.text,
            metadata: {

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
// Inside chroma client added a embedding function that will handle the embedding it's own
// This method manually perfom embedding 
// Not in use right now
// export const EmbedChunk = async (chunks) => {

//     const rawText = chunks.map(chunk => chunk.pageContent)
//     const vector = await embedding.embedDocuments(rawText)
//     return vector
// }
// 4. Storing in VectorDB
const StoreVectors = async (ids, docs, metadatas) => {
    const result = await chromaCollection.add({
        ids: ids,
        documents: docs,
        metadatas: metadatas
    })
    return result
}

export const initDataIngestion = async (buffer, sessionId) => {
    try {
        const docs = await loadPdf(buffer)

        const chunks = await chunkPdf(docs)

        // const vectors = await EmbedChunk(chunks)

        let ids = []
        let metadatas = []

        for (let i = 1; i <= chunks.length; i++) {
            const id = `doc_${uuid4()}_${i}`
            const metadata = { sessionId: sessionId }
            ids.push(id)
            metadatas.push(metadata)

        }
        const chunks_text = chunks.map(chunk => chunk.pageContent)
        const response = await StoreVectors(ids, chunks_text, metadatas)
        return response
    } catch (error) {
        console.log('Something went wrong ----', error);
    }


}