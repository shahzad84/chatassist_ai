import { Router } from "express";
import { v4 as uuidv4 } from "uuid";

import { generateReply } from "../services/llm.js";
import {
  createConversation,
  saveMessage,
  getMessages,
} from "../respository/messageRepository.js";

const router = Router();

router.post("/message", async (req, res) => {
  try {
    const { message } = req.body;
    let { sessionId } = req.body;

    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
        res.status(400).json({
        error: "Message is required",
        });
        return;
    }
    if (message.length > 2000) {
      return res.status(400).json({
        error: "Message exceeds maximum length",
      });
    }

    if (!sessionId) {
      sessionId = uuidv4();
      
    }
    createConversation(sessionId);

    const cleanedMessage = message.trim();
    saveMessage(
      sessionId,
      "user",
      cleanedMessage
    );
    const history = getMessages(sessionId);

    const reply =(await generateReply(history, cleanedMessage)) ?? "Sorry, I couldn't generate a response.";

    saveMessage(
      sessionId,
      "ai",
      reply
    );

    res.json({
      reply,
      sessionId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
    error:
        "Our support assistant is temporarily unavailable. Please try again in a moment.",
    });
  }
});

router.get(
  "/history/:sessionId",
  (req, res) => {
    try {
      const messages = getMessages(
        req.params.sessionId
      );

      res.json(messages);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Failed to load history",
      });
    }
  }
);

export default router;