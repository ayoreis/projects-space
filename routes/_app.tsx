import { define } from "../define.ts";

export default define.page(({ Component }) => {
	return (
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width" />

				<title>Projects Space</title>

				<link rel="stylesheet" href="/styles.css" />
				<link rel="icon" href="/favicon.svg" />
			</head>

			<body>
				<header>
					<nav>
						<menu>
							<li>
								<a href="/">Home</a>
							</li>

							<li>
								<a href="/login">Login</a>
							</li>
						</menu>
					</nav>
				</header>

				<main>
					<Component />
				</main>

				<footer>
					<p>
						<a target="_blank" href="https://github.com/ayoreis/projects-space">
							(source)
						</a>
					</p>
				</footer>
			</body>
		</html>
	);
});
