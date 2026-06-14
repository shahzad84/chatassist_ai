import db from "../db/database.js";
export function createConversation(sessionId) {
    db.prepare(`
    INSERT OR IGNORE INTO conversations(id)
    VALUES(?)
  `).run(sessionId);
}
export function saveMessage(sessionId, sender, text) {
    db.prepare(`
    INSERT INTO messages(
      conversation_id,
      sender,
      text
    )
    VALUES (?, ?, ?)
  `).run(sessionId, sender, text);
}
export function getMessages(sessionId) {
    return db
        .prepare(`
      SELECT *
      FROM messages
      WHERE conversation_id = ?
      ORDER BY created_at ASC
    `)
        .all(sessionId);
}
export function conversationExists(sessionId) {
    const result = db
        .prepare(`       SELECT id
      FROM conversations
      WHERE id = ?
    `)
        .get(sessionId);
    return !!result;
}
//# sourceMappingURL=messageRepository.js.map