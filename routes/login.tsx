import { define } from "../define.ts";

const client_id = Deno.env.get("CLIENT_ID");

export default define.page(() => {
	return (
		<>
			<h1>Login</h1>
			<a
				href={`https://github.com/login/oauth/authorize?client_id=${client_id}`}
				class="github"
			>
				Login with GitHub
			</a>
		</>
	);
});
