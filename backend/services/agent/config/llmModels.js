import dotenv from "dotenv"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env") })

const groq = new ChatGroq({
    model: "openai/gpt-oss-120b"
})

const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-3.8-flash"
})

export const getModel=(agent)=>{
    switch (agent) {
        case "chat":   
            return groq;
        case "router":
            return groq;
        case "search":   
            return groq;
        case "coding":   
            return groq;
        default:
            return groq;
    }
}