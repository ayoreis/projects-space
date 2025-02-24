import { STATUS_CODE } from "@std/http/status";
import { define } from "../utils.ts";
import { delete_session } from "../database/sessions.ts";

export const handler = define.handlers({
	POST(context) {
		if (!context.state.user) {
			return new Response("Not logged in", { status: STATUS_CODE.BadRequest });
		}

		delete_session(context.state.session);

		const headers = new Headers();

		headers.append("Set-Cookie", "__Host-session=; Max-Age=0; Secure");
		headers.append("Location", "/");

		return new Response(null, { status: STATUS_CODE.SeeOther, headers });
	},
});
