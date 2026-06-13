import Database from "better-sqlite3";
import type { Database as BetterSqliteDatabase } from "better-sqlite3";

const db: BetterSqliteDatabase = new Database("chat.db");
db.pragma("foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id TEXT NOT NULL,

  sender TEXT NOT NULL
  CHECK(sender IN ('user', 'ai')),

  text TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (conversation_id)
  REFERENCES conversations(id)
  ON DELETE CASCADE
);

  CREATE INDEX IF NOT EXISTS
  idx_messages_conversation_id
  ON messages(conversation_id);

`);

export default db;