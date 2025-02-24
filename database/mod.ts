import { Database } from "sqlite";

export const database = new Database("database.db");

database.exec(
	`CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY NOT NULL,
	username TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
	id TEXT PRIMARY KEY NOT NULL,
	user_id INTEGER NOT NULL,
	datetime INTEGER NOT NULL DEFAULT (unixepoch())
);`,
);
