import { define } from "../define.ts";

interface AccessToken {
	access_token?: string;
}

interface User {
	id: number;
}

const client_id = Deno.env.get("CLIENT_ID")!;
const client_secret = Deno.env.get("CLIENT_SECRET")!;

export default define.page(async (props) => {
	const code = props.url.searchParams.get("code");

	if (code) {
		const body = new URLSearchParams({ client_id, client_secret, code });

		const { access_token } = await (await fetch(
			"https://github.com/login/oauth/access_token",
			{
				method: "POST",
				body,
				headers: { "Accept": "application/json" },
			},
		)).json() as AccessToken;

		if (!access_token) {
			return (
				<h1>
					Unable to exange code <code>{code}</code> for token
				</h1>
			);
		}

		const user = await (await fetch("https://api.github.com/user", {
			headers: { "Authorization": `Bearer ${access_token}` },
		})).json() as User;

		return (
			<h1>
				Got token <code>{access_token}</code> from code{" "}
				<code>{code}</code>, got user id <code>{user.id}</code> from token
			</h1>
		);
	}

	return (
		<hgroup>
			<h1>Welcome to Projects Space</h1>
			<p>A space for projects</p>
		</hgroup>
	);
});
