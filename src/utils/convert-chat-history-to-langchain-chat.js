import { HumanMessage, AIMessage } from '@langchain/core/messages'
export const convertChatHistorToLangchainChat = (chatHistory) => {
    const chat = chatHistory.map(msg => {
        if (msg.role.toLowerCase() === "user") {
            return new HumanMessage(msg.message)
        } else {
            return new AIMessage(msg.message)
        }
    })
    return chat
}