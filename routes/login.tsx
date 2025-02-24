import { STATUS_CODE } from "@std/http";
import { page } from "fresh";
import { define } from "../utils.ts";
import { cookie } from "../cookies.ts";

const client_id = Deno.env.get("CLIENT_ID")!;

export const handler = define.handlers({
	GET(context) {
		if (context.state.user !== null) {
			return new Response("User already logged in", {
				status: STATUS_CODE.BadRequest,
			});
		}

		const state = crypto.randomUUID();
		const state_cookie = cookie("state", state);

		return page({ state }, {
			headers: { "Set-Cookie": state_cookie },
		});
	},
});

export default define.page<typeof handler>((context) => {
	return (
		<>
			<h1>Log in</h1>

			<a
				href={`https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=http://localhost:8000/login-callback&state=${context.data.state}`}
			>
				Log in with GitHub
			</a>
		</>
	);
});
