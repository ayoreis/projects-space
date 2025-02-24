import type { User } from "./users.ts";
import { database } from "./mod.ts";

export interface Session {
	id: string;
	user_id: string;
	datetime: number;
}

const create_session_statement = database.prepare(
	`INSERT INTO sessions (id, user_id)
VALUES (:id, :user_id)
RETURNING *;`,
);

export function create_session(id: Session["id"], user_id: User["id"]) {
	return create_session_statement.get<Session>({ id, user_id })!;
}

const get_sessions_by_user_statement = database.prepare(
	`SELECT sessions.id AS id, user_id, datetime FROM sessions
JOIN users ON users.id = sessions.user_id
WHERE users.id = :id;`,
);

export function get_sessions_by_user(id: User["id"]) {
	return get_sessions_by_user_statement.all<Session>({ id });
}

const delete_session_statement = database.prepare(
	`DELETE FROM sessions
WHERE id = :id;`,
);

export function delete_session(id: Session["id"]) {
	delete_session_statement.run({ id });
}

const delete_sessions_by_user_statement = database.prepare(
	`DELETE FROM sessions
WHERE user_id = :id;`,
);

export function delete_sessions_by_user(id: User["id"]) {
	delete_sessions_by_user_statement.run({ id });
}
