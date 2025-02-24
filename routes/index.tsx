import { get_sessions_by_user } from "../database/sessions.ts";
import { define } from "../utils.ts";

export default define.page((context) => {
	const { user } = context.state;
	if (!user) return <h1>Projects Space</h1>;

	return (
		<>
			<h1>Projects Space</h1>

			<h2>Sessions</h2>

			<table>
				<tr>
					<th>Session</th>
					<th>Date</th>
				</tr>

				{get_sessions_by_user(user.id).map((session) => {
					return (
						<tr>
							<td>{session.id}</td>

							<td>
								<time>
									{Temporal.Instant.fromEpochMilliseconds(
										session.datetime * 1000,
									)
										.toLocaleString()}
								</time>
							</td>
						</tr>
					);
				})}
			</table>

			<h2>Account</h2>

			<form method="post" action="/delete-account">
				<button>Delete account</button>
			</form>
		</>
	);
});
