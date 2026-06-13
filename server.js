import express from "express"
import cors from "cors"
import upload from "./src/utils/upload.js"
import { initDataIngestion } from "./src/RAG/data-ingestion.js"
import { dataRetrieval } from "./src/RAG/data-retrieval.js"
import { generateLLMResponse } from "./src/RAG/data-generation.js"
import path, { dirname } from "path"
import { fileURLToPath } from "url"

const app = express()
const port = process.env.PORT || 5000
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
app.use(express.json())
app.use(cors())

app.use(express.static(path.join(__dirname, "public")))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public"))
})

app.post("/upload", upload.single('pdf'), (req, res) => {
    if (!req.file) {
        res.status(400).json({ "msg": "File not uploaded" })
    }
    initDataIngestion(req.file.path)
    res.json({ msg: "file recieved", file: { name: req.file.originalname } })
})

app.post("/chat", async (req, res) => {
    const { query } = req.body
    const relatedDocs = await dataRetrieval(query)
    const response = await generateLLMResponse(query, relatedDocs)
    res.json({ query: query, llmResponse: response, })
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);

})