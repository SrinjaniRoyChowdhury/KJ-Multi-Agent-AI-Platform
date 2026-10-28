import axios from "axios";
import { graph } from "../graph/graph.js";
import { addMessage } from "../config/memory.js";

// Helper - non-fatal save so a DB error never kills the agent response
const saveMessage = async (conversationId, role, content) => {
  try {
    await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
      conversationId,
      role,
      content,
    });
  } catch (err) {
    console.warn(`⚠️  save-message failed (${role}):`, err?.response?.data?.message || err.message);
  }
};

export const agent = async (req, res) => {
  try {
    const { prompt, conversationId, agent } = req.body;
    console.log(" Agent called:", { prompt: prompt?.slice(0, 50), conversationId });

    if (!prompt) {
      return res.status(400).json({ message: "prompt is required" });
    }

    // Save user message (non-fatal)
    await saveMessage(conversationId, "user", prompt);

    // Run the agent graph
    console.log("Invoking graph...");
    const result = await graph.invoke({ prompt, conversationId, agent });

    console.log("Graph result keys:", Object.keys(result));
    const response = result.aiResponse;
    console.log("aiResponse:", typeof response, response?.slice?.(0, 80));

    if (!response) {
      console.error("aiResponse is undefined. Full result:", JSON.stringify(result));
      return res.status(500).json({ message: "Agent produced no response" });
    }

    // Update in-memory conversation history
    await addMessage({ conversationId, role: "user", content: prompt });
    await addMessage({ conversationId, role: "assistant", content: response });

    await axios.post(`${process.env.CHAT_SERVICE}/save-messages`, {
      conversationId,role:"assistant",content:result.aiResponse,images:result.images
    })

    return res.status(200).json({
      answer:result.aiResponse,
      images:result.images
    });

  } catch (error) {
    console.error("Agent error:", error.message);
    console.error(error.stack);
    return res.status(500).json({ message: `Agent error: ${error.message}` });
  }
};