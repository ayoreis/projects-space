import { define } from "../define.ts";

export default define.page(({ url }) => {
	return (
		<h1>
			<code>{url.pathname}</code> not found
		</h1>
	);
});
