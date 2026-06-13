import { generateReply } from "./llm.js";

import {
  createConversation,
  saveMessage,
  getMessages,
} from "../respository/messageRepository.js";

export async function processChatMessage(sessionId: string, message: string) {
  createConversation(sessionId);

  saveMessage(sessionId, "user", message);

  const history = getMessages(sessionId);

  try {
    const reply =
      (await generateReply(history, message)) ??
      "Sorry, I couldn't generate a response.";

    saveMessage(sessionId, "ai", reply);

    return {
      reply,
      sessionId,
    };
  } catch (error) {
    const fallback = "Our support assistant is temporarily unavailable.";

    saveMessage(sessionId, "ai", fallback);

    throw error;
  }
}
