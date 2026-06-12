import { ChatPromptTemplate } from "@langchain/core/prompts"
import { llm } from "../config/llm.js"


// 1. Prepare Context / Clean Context
const prepareContext = (relatedDocs) => {
    const context = relatedDocs.documents.join("\n")
    return context
}

export const generateLLMResponse = async (query, relatedDocs) => {
    try {
        const context = prepareContext(relatedDocs)

        // 2. Create Prompt
        const prompt = ChatPromptTemplate.fromTemplate(`Use the given context to answer user's query
Context:{context}
Query:{query}
Answer:""`)

        // 3. Create Chain
        const chain = prompt.pipe(llm)
        // 4. Invoke LLM
        const response = await chain.invoke({ context: context, query: query })
        return response.content
    } catch (error) {
        console.log('Error in LLM Generation:=>', error)
    }
}
