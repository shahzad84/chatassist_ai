import db from "../db/database.js";

export function createConversation(
  sessionId: string
) {
  db.prepare(
    `
    INSERT OR IGNORE INTO conversations(id)
    VALUES(?)
  `
  ).run(sessionId);
}

export function saveMessage(
  sessionId: string,
  sender: string,
  text: string
) {
  db.prepare(
    `
    INSERT INTO messages(
      conversation_id,
      sender,
      text
    )
    VALUES (?, ?, ?)
  `
  ).run(sessionId, sender, text);
}

export function getMessages(
  sessionId: string
) {
  return db
    .prepare(
      `
      SELECT *
      FROM messages
      WHERE conversation_id = ?
      ORDER BY created_at ASC
    `
    )
    .all(sessionId);
}