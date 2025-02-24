import { getCookies } from "@std/http";
import { App, fsRoutes, staticFiles } from "fresh";
import type { State } from "./utils.ts";
import { cookie } from "./cookies.ts";
import { get_user_by_session } from "./database/users.ts";

export const app = new App<State>();

app.use(staticFiles());

await fsRoutes(app, {
	dir: "./",
	loadRoute: (path) => import(`./routes/${path}`),
	loadIsland: (path) => import(`./islands/${path}`),
});

app.use((context) => {
	context.state.cookies = getCookies(context.req.headers);
	return context.next();
});

app.use(async (context) => {
	const session = context.state.cookies[cookie("session")];

	if (session !== undefined) {
		const user = get_user_by_session(session);

		if (user) {
			context.state.user = user;
			context.state.session = session;
		}
	}

	context.state.user ??= null;
	context.state.session ??= null;

	const response = await context.next();

	if (context.state.user === null || context.state.session === null) {
		response.headers.append("Set-Cookie", cookie("session", null));
	}

	return response;
});

if (import.meta.main) {
	await app.listen();
}
