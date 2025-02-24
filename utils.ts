import { createDefine } from "fresh";
import type { User } from "./database/users.ts";

export type State =
	& {
		cookies: Record<string, string>;
		csrf_token: string | null;
	}
	& ({
		user: User;
		session: string;
	} | {
		user: null;
		session: null;
	});

export const define = createDefine<State>();
