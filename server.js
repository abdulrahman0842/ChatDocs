import express from "express"
import cors from "cors"
import upload from "./src/utils/upload.js"
import { initDataIngestion } from "./src/RAG/data-ingestion.js"
const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(cors())


app.get("/", (req, res) => {
    res.json({ msg: "Hello" })
})

app.post("/upload-pdf", upload.single('pdf'), (req, res) => {
    if (!req.file) {
        res.status(400).json({ "msg": "File not uploaded" })
    }
    initDataIngestion(req.file.path)
    res.json({ msg: "file recieved", file: { name: req.file.originalname } })



})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);

})