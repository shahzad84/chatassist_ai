import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { LLMError } from "../services/llm.js";
import { getMessages, conversationExists, } from "../respository/messageRepository.js";
import { processChatMessage } from "../services/chat.js";
import rateLimit from "express-rate-limit";
const messageLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Too many messages sent. Please wait a few minutes before trying again.",
    },
});
const router = Router();
router.post("/message", messageLimiter, async (req, res) => {
    try {
        const { message } = req.body;
        let { sessionId } = req.body;
        if (typeof message !== "string" ||
            !message.trim()) {
            res.status(400).json({
                error: "Message is required",
            });
            return;
        }
        const cleanedMessage = message.trim();
        if (cleanedMessage.length > 1000) {
            return res.status(400).json({
                error: "Message exceeds maximum length",
            });
        }
        if (!sessionId) {
            sessionId = uuidv4();
        }
        const result = await processChatMessage(sessionId, cleanedMessage);
        res.json(result);
    }
    catch (error) {
        console.error(error);
        if (error instanceof LLMError) {
            return res.status(503).json({
                error: error.message,
            });
        }
        res.status(500).json({
            error: "Our support assistant is temporarily unavailable. Please try again in a moment.",
        });
    }
});
router.get("/history/:sessionId", (req, res) => {
    try {
        const { sessionId } = req.params;
        if (!conversationExists(sessionId)) {
            return res.status(404).json({
                error: "Conversation not found",
            });
        }
        const messages = getMessages(sessionId);
        res.json(messages);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to load chat history",
        });
    }
});
export default router;
//# sourceMappingURL=chat.js.map