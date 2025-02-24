import { STATUS_CODE } from "@std/http/status";
import { define } from "../utils.ts";
import { cookie } from "../cookies.ts";
import { get_user } from "../database/users.ts";
import { create_session } from "../database/sessions.ts";
import type * as Github from "../github.ts";
import * as github from "../github.ts";

export const handler = define.handlers({
	async GET(context) {
		const code = context.url.searchParams.get("code");

		if (code === null) {
			return new Response("Code parameter missing", {
				status: STATUS_CODE.BadRequest,
			});
		}

		const state_cookie = context.state.cookies[cookie("state")];

		if (state_cookie === undefined) {
			return new Response("State cookie missing", {
				status: STATUS_CODE.BadRequest,
			});
		}

		const headers = new Headers({ "Set-Cookie": cookie("state", null) });
		const state_parameter = context.url.searchParams.get("state");

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

		const user = get_user(github_user.id);

		if (user === null) {
			return new Response("Account doesn't exists, sign up instead", {
				status: STATUS_CODE.BadRequest,
				headers,
			});
		}

		const session = create_session(crypto.randomUUID(), user.id);

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
