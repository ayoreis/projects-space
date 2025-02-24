import { define } from "../utils.ts";

export default define.page(({ url }) => {
	return (
		<h1>
			<code>{url.pathname}</code> not found
		</h1>
	);
});
