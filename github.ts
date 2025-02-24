export interface AccessToken {
	access_token: string;
	scope: string;
	token_type: "bearer";
}

export interface User {
	id: number;
}

const client_id = Deno.env.get("CLIENT_ID")!;
const client_secret = Deno.env.get("CLIENT_SECRET")!;

export async function exchange_code_for_access_token(code: string) {
	const response = await fetch("https://github.com/login/oauth/access_token", {
		method: "POST",
		body: new URLSearchParams({
			client_id,
			client_secret,
			code,
			redirect_uri: "http://localhost:8000/signup-callback",
		}),
		headers: { "Accept": "application/json" },
	});

	return await response.json() as AccessToken;
}

export async function get_user(access_token: string) {
	const response = await fetch("https://api.github.com/user", {
		headers: { "Authorization": `Bearer ${access_token}` },
	});

	return await response.json() as User;
}
