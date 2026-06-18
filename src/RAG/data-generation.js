import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts"
import { llm } from "../config/llm.js"

// This function mocks the chain.stream() behaviour 
// async function* mockLLMStream(query) {
//     const mockReply = `The training set is used to teach the model, whether it's the ANN or CNN, by learning the
// patterns and relationships in the data. The test set is reserved to evaluate how well the trained
// model performs on unseen data, ensuring that it can generalize to new, real-world cases.
// The use of CNN is particularly useful for tasks like image classification, object detection, or
// any task where spatial hierarchies and patterns are important. CNNs apply convolutional
// filters to detect local features, such as edges, textures, and shapes, making them highly
// effective in visual data analysis.
// By splitting the data into training and test sets, we can prevent the models from overfitting,
// where they might memorize the data instead of learning the underlying patterns. The test set
// provides a realistic evaluation of how the model would perform in real-world scenarios when
// deployed.
// `;

//     // Split text into words to simulate tokens
//     const chunks = mockReply.split(".");

//     for (const chunk of chunks) {
//         // Wait 80ms between each chunk to simulate natural LLM speed
//         await new Promise(resolve => setTimeout(resolve, 300));

//         // Yield an object that matches LangChain's chunk object structure (chunk.content)
//         yield { content: chunk + " " };
//     }
// }
// 1. Prepare Context / Clean Context


// Stringify retrieved related documents from VectorDB

const prepareContext = (relatedDocs) => {
    const context = relatedDocs.documents.join("\n")
    return context
}

export const generateLLMResponse = async (query, relatedDocs, chatHistory, res) => {
    try {
        // 1. Stringify the retrieved related documents from vector DB
        const context = prepareContext(relatedDocs)

        // 2. Create Prompt
        const prompt = ChatPromptTemplate.fromMessages([
            [
                "system",
                `Use the given context to answer the user's query. If you do not know the answer based on the context, say "I don't know".
    
                Context:
                {context}`
            ],
            new MessagesPlaceholder('chatHistory'),
            ["human", "{query}"]
        ]);

        // 3. Create Chain
        const chain = prompt.pipe(llm)

        // 4. Create Open Http Connection
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        })

        // 5. Invoke LLM as stream response
        const stream = await chain.stream({ context: context, query: query, chatHistory: chatHistory })
        // const stream = await mockLLMStream(query)
        
        // 6. Sent chunk of response
        for await (let chunk of stream) {
            const content = chunk.content || ""
            res.write(`data:${JSON.stringify({ content })}\n\n`)
        }

        // 7. LLM response complete send final [DONE] flag and Close connection
        res.write(`data:[DONE]\n\n`)
        res.end()
        
    } catch (error) {
        console.log('Error in LLM Generation:=>', error)
        if (!res.headersSent) {
            res.status(500).json({ error: "Internal Server Error." })
        } else {
            res.send()
        }

    }
}
