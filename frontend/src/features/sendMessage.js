import api from "../../utils/axios";

async function sendMessage(payload) {
    try{
        const {data} = await api.post("/api/agent/chat", payload)
        console.log("Agent response:", data)
        return data
    } catch(error) {
        console.error("sendMessage error:", error?.response?.data || error.message)
        return null
    }
}

export default sendMessage