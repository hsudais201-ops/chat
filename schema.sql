CREATE TABLE IF NOT EXISTS users (
  username TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender TEXT NOT NULL,
  recipient TEXT NOT NULL,
  body TEXT NOT NULL CHECK(length(body) <= 4000),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY(sender) REFERENCES users(username),
  FOREIGN KEY(recipient) REFERENCES users(username)
);
CREATE INDEX IF NOT EXISTS messages_conversation_idx ON messages(sender, recipient, id);