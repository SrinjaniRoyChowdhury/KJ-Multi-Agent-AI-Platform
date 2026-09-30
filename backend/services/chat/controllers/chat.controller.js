import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const createConversation = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        console.log("userId:", userId);

        const conversation = await Conversation.create({
            userId,
        });

        return res.status(201).json(conversation);
    } catch (error) {
        return res.status(500).json({
            message: `Create conversation error: ${error.message}`,
        });
    }
};

export const getConversations = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        console.log("userId:", userId);

        const conversations = await Conversation.find({
            userId,
        }).sort({ createdAt: -1 });

        return res.status(200).json(conversations);
    } catch (error) {
        return res.status(500).json({
            message: `Get conversations error: ${error.message}`,
        });
    }
};

export const updateConversation = async (req, res) => {
    try {
        const {id,title} = req.body
        const conversations = await Conversation.findByIdAndUpdate(id,{
            title
        });

        return res.status(200).json(conversations);
    } catch (error) {
        return res.status(500).json({
            message: `Update conversations error: ${error.message}`,
        });
    }
};

export const saveMessage = async (req, res) => {
    try {
        const { conversationId, role, content } = req.body;

        const message = await Message.create({
            conversationId,
            content,
            role,
        });

        return res.status(201).json(message);
    } catch (error) {
        return res.status(500).json({
            message: `Save message error: ${error.message}`,
        });
    }
};

export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId:req.params.conversationId,
        }).sort({ createdAt: 1 });

        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({
            message: `Get messages error: ${error.message}`,
        });
    }
};