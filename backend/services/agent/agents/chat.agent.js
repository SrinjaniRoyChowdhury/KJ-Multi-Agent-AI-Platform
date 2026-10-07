import { getModel } from "../config/llmModels.js"

export const chatAgent=async (state)=> {
    const llm= await getModel("chat")
    const prompt="You are KJ, an intelligent AI assitent."

    const response=await llm.invoke([
        {
            "role":"system",
            "content":systemPrompt
        },{
            "role":"human",
            "content":state.prompt
        }
    ])

    return {
        ...state,
        airesponse:response.content
    }
}