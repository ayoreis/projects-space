import { define } from "../utils.ts";

export default define.page(({ Component, state }) => {
	return (
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width" />

				<title>Projects Space</title>
			</head>

			<body>
				<header>
					<nav>
						<form id="logout" method="post" action="/logout"></form>

						<menu>
							<li>
								<a href="/">Home</a>
							</li>

							{state.user
								? (
									<li>
										{state.user.username}{" "}
										(<button form="logout">Log out</button>)
									</li>
								)
								: (
									<>
										<li>
											<a href="/signup">Sign up</a>
										</li>

										<li>
											<a href="/login">Log in</a>
										</li>
									</>
								)}
						</menu>
					</nav>
				</header>

				<main>
					<Component />
				</main>
			</body>
		</html>
	);
});
