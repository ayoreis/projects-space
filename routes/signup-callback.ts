import { STATUS_CODE } from "@std/http/status";
import { define } from "../utils.ts";
import { cookie } from "../cookies.ts";
import {
	create_user,
	user_exists,
	user_exists_by_username,
} from "../database/users.ts";
import { create_session } from "../database/sessions.ts";
import type * as Github from "../github.ts";
import * as github from "../github.ts";

const USERNAME = /^[a-z]+$/;

export const handler = define.handlers({
	async GET(context) {
		const headers = new Headers({ "Set-Cookie": cookie("username", null) });
		const code = context.url.searchParams.get("code");

		if (code === null) {
			return new Response("Code parameter missing", {
				status: STATUS_CODE.BadRequest,
				headers,
			});
		}

		const state_cookie = context.state.cookies[cookie("state")];

		if (state_cookie === undefined) {
			return new Response("State cookie missing", {
				status: STATUS_CODE.BadRequest,
				headers,
			});
		}

		const state_parameter = context.url.searchParams.get("state");
		headers.append("Set-Cookie", cookie("state", null));

		if (state_parameter === null) {
			return new Response("State parameter missing", {
				status: STATUS_CODE.BadRequest,
				headers,
			});
		}

		if (state_parameter !== state_cookie) {
			return new Response("States don't match", {
				status: STATUS_CODE.BadRequest,
				headers,
			});
		}

		const username = context.state.cookies[cookie("username")];

		if (username === undefined) {
			return new Response("Username cookie missing", {
				status: STATUS_CODE.BadRequest,
				headers,
			});
		}

		if (user_exists_by_username(username)) {
			return new Response("Username is taken", {
				status: STATUS_CODE.BadRequest,
				headers,
			});
		}

		if (!USERNAME.test(username)) {
			return new Response("Username invalid", {
				status: STATUS_CODE.BadRequest,
			});
		}

		let github_access_token: Github.AccessToken;

		try {
			github_access_token = await github.exchange_code_for_access_token(code);
		} catch {
			// TODO Improve this error message
			return new Response("Cannot exchange code for access token", {
				status: STATUS_CODE.InternalServerError,
				headers,
			});
		}

		if (github_access_token.scope !== "") {
			return new Response("Scopes don't match", {
				status: STATUS_CODE.BadRequest,
				headers,
			});
		}

		let github_user: Github.User;

		try {
			github_user = await github.get_user(github_access_token.access_token);
		} catch {
			// TODO Improve this error message
			return new Response("Cannot get GitHub user", {
				status: STATUS_CODE.InternalServerError,
				headers,
			});
		}

		if (user_exists(github_user.id)) {
			return new Response("Account exists, log in instead", {
				status: STATUS_CODE.BadRequest,
				headers,
			});
		}

		const user = create_user(github_user.id, username);
		const session = create_session(crypto.randomUUID(), github_user.id);

		context.state.user = user;
		context.state.session = session.id;

		headers.append("Set-Cookie", cookie("session", session.id));
		headers.append("Location", "/");

		return new Response(null, {
			status: STATUS_CODE.TemporaryRedirect,
			headers,
		});
	},
});
