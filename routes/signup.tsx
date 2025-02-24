import { STATUS_CODE } from "@std/http";
import { page } from "fresh";
import { define } from "../utils.ts";
import { cookie } from "../cookies.ts";
import { user_exists_by_username } from "../database/users.ts";

const CSRF_TOKEN_NAME = "csrf_token";
const USERNAME = /^[a-z]+$/;
const client_id = Deno.env.get("CLIENT_ID")!;

export const handler = define.handlers({
	GET(context) {
		if (context.state.user !== null) {
			return new Response("User already signed up", {
				status: STATUS_CODE.BadRequest,
			});
		}

		const csrf_token = crypto.randomUUID();
		const csrf_token_cookie = cookie(CSRF_TOKEN_NAME, csrf_token);

		return page({ csrf_token }, {
			headers: { "Set-Cookie": csrf_token_cookie },
		});
	},

	async POST(context) {
		const csrf_token_cookie = context.state.cookies[cookie(CSRF_TOKEN_NAME)];

		if (csrf_token_cookie === undefined) {
			return new Response(`CSRF token cookie missing`, {
				status: STATUS_CODE.BadRequest,
			});
		}

		const headers = new Headers({
			"Set-Cookie": cookie(CSRF_TOKEN_NAME, null),
		});
		let form_data: FormData;

		try {
			form_data = await context.req.formData();
		} catch {
			return new Response("Body is not valid form data", {
				status: STATUS_CODE.BadRequest,
				headers,
			});
		}

		const csrf_token_field = form_data.get(CSRF_TOKEN_NAME);

		if (csrf_token_field === null) {
			return new Response("CSRF token field missing", {
				status: STATUS_CODE.BadRequest,
				headers,
			});
		}

		if (csrf_token_cookie !== csrf_token_field) {
			return new Response("CSRF tokens don't match", {
				status: STATUS_CODE.BadRequest,
				headers,
			});
		}

		const username = form_data.get("username");

		if (username === null) {
			return new Response("Username field missing", {
				status: STATUS_CODE.BadRequest,
				headers,
			});
		}

		if (typeof username !== "string") {
			return new Response("Username field is not string", {
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
				headers,
			});
		}

		const state = crypto.randomUUID();

		headers.append("Set-Cookie", cookie("state", state));
		headers.append("Set-Cookie", cookie("username", username));
		headers.append(
			"Location",
			`https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=http://localhost:8000/signup-callback&state=${state}`,
		);

		return new Response(null, { status: STATUS_CODE.SeeOther, headers });
	},
});

export default define.page<typeof handler>((context) => {
	return (
		<>
			<h1>Sign up</h1>

			<form method="post">
				<input
					type="hidden"
					name={CSRF_TOKEN_NAME}
					value={context.data.csrf_token}
				/>

				<label>
					Username{" "}
					<input
						name="username"
						required
						pattern="[a-z]+"
						autocapitalize="off"
						autocomplete="username"
					/>
				</label>

				<button>Sign up with GitHub</button>
			</form>
		</>
	);
});
