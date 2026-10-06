import { Anotation } from '@langchain/langgraph'

export const agentState=Anotation.Root({
    prompt:Anottation(),
    aiResponse:Anotation(),
    agent:Anotation()
})