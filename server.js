import express from "express"
import cors from "cors"
import upload from "./src/utils/upload.js"
import { initDataIngestion } from "./src/RAG/data-ingestion.js"
import { dataRetrieval } from "./src/RAG/data-retrieval.js"
import { generateLLMResponse } from "./src/RAG/data-generation.js"
import path, { dirname } from "path"
import { fileURLToPath } from "url"
import morgan from "morgan"
import { convertChatHistorToLangchainChat } from "./src/utils/convert-chat-history-to-langchain-chat.js"

const app = express()
const port = process.env.PORT || 5000
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
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
    const { query, chatHistory } = req.body
    const chatMessages = convertChatHistorToLangchainChat(chatHistory)
    const relatedDocs = await dataRetrieval(query, chatMessages)
    generateLLMResponse(query, relatedDocs, chatMessages, res)

    // generateCondensedQuery('How do they detect those local features like edges?', [
    //     {
    //         "role": "user",
    //         "message": "Why do we need to split data into a training set and a test set?"
    //     },
    //     {
    //         "role": "assistant",
    //         "message": "The training set is used to teach the model, whether it's an ANN or CNN, by learning the patterns and relationships in the data. The test set is reserved to evaluate how well the trained model performs on unseen data, ensuring that it can generalize to new, real-world cases."
    //     },
    //     {
    //         "role": "user",
    //         "message": "What happens if we don't use a test set and just train on everything?"
    //     },
    //     {
    //         "role": "assistant",
    //         "message": "By splitting the data into training and test sets, we can prevent the models from overfitting, where they might memorize the data instead of learning the underlying patterns. The test set provides a realistic evaluation of how the model would perform in real-world scenarios when deployed."
    //     },
    //     {
    //         "role": "user",
    //         "message": "That makes sense. Now, when is a CNN particularly useful compared to a standard ANN?"
    //     },
    //     {
    //         "role": "assistant",
    //         "message": "The use of CNN is particularly useful for tasks like image classification, object detection, or any task where spatial hierarchies and patterns are important. CNNs apply convolutional filters to detect local features, such as edges, textures, and shapes, making them highly effective in visual data analysis."
    //     },
    //     {
    //         "role": "user",
    //         "message": "How do they detect those local features like edges?"
    //     }
    // ])
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);

})