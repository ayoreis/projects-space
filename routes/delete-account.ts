import { STATUS_CODE } from "@std/http";
import { delete_user } from "../database/users.ts";
import { define } from "../utils.ts";
import { delete_sessions_by_user } from "../database/sessions.ts";

export const handler = define.handlers({
	POST(context) {
		const { user } = context.state;

		if (!user) {
			return new Response("User not logged in", {
				status: STATUS_CODE.BadRequest,
			});
		}

		delete_user(user.id);
		delete_sessions_by_user(user.id);

		return new Response(null, {
			status: STATUS_CODE.SeeOther,
			headers: {
				"Location": "/",
			},
		});
	},
});
