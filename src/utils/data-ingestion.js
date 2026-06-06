import { Document } from "@langchain/core/documents";
import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";

// 1. Load PDF
const loadPdf = async (filePath) => {
    const parser = new PDFParse({ url: filePath, })
    const data = await parser.getText()
    return new Document(
        {
           pageContent:data.text,
           metadata:{
            source:filePath
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

// 4. Storing in VectorDB


export const initDataIngestion = async (filePath) => {
    const docs = await loadPdf(filePath)
    
    const chunks = await chunkPdf(docs)
}