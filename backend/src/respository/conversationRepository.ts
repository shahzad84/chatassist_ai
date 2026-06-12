import type { Conversation } from "../types/chat.js";

const conversations = new Map<
  string,
  Conversation
>();

export function getConversation(
  id: string
) {
  return conversations.get(id);
}

export function saveConversation(
  conversation: Conversation
) {
  conversations.set(
    conversation.id,
    conversation
  );
}