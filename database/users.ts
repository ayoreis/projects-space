import type { Session } from "./sessions.ts";
import { database } from "./mod.ts";

export interface User {
	id: number;
	username: string;
}

const create_user_statement = database.prepare(
	`INSERT INTO users (id, username)
VALUES (:id, :username)
RETURNING *;`,
);

export function create_user(id: User["id"], username: User["username"]) {
	return create_user_statement.get<User>({ id, username })!;
}

const user_exists_statement = database.prepare(
	`SELECT EXISTS (SELECT 1 FROM users WHERE id = :id) AS user_exists;`,
);

export function user_exists(id: User["id"]) {
	return Boolean(
		user_exists_statement.get<{ user_exists: number }>({ id })!.user_exists,
	);
}

const user_exists_by_username_statement = database.prepare(
	`SELECT EXISTS (SELECT 1 FROM users WHERE username = :username) AS user_exists;`,
);

export function user_exists_by_username(username: User["username"]) {
	return Boolean(
		user_exists_by_username_statement
			.get<{ user_exists: number }>({ username })!.user_exists,
	);
}

const get_user_statement = database.prepare(
	`SELECT * FROM users
WHERE id = :id;`,
);

export function get_user(id: User["id"]) {
	return get_user_statement.get<User>({ id }) ?? null;
}

const get_user_by_session_statement = database.prepare(
	`SELECT users.id AS id, username FROM users
JOIN sessions ON users.id = sessions.user_id
WHERE sessions.id = :id;`,
);

export function get_user_by_session(id: Session["id"]) {
	return get_user_by_session_statement.get<User>({ id }) ?? null;
}

const delete_user_statement = database.prepare(
	`DELETE FROM users
WHERE id = :id;`,
);

export function delete_user(id: User["id"]) {
	delete_user_statement.run({ id });
}
