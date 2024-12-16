const ERROR_TEMPLATE = "Template error.";

async function load_navbar() {
	const header = document.getElementById("header");
	var navbar = await new Template("frontend/html/navbar.html").load();

	if (navbar == null)
		return console.error(ERROR_TEMPLATE);
	header.innerHTML = navbar.string;
}

async function load_home() {
	const body = document.getElementById("body");
	var content = await new Template("frontend/html/pages/home.html").load();

	if (content == null)
		return console.error(ERROR_TEMPLATE);
	load_navbar();
	body.innerHTML = content.string;
	if (window.location.pathname !== "/home") {
		history.pushState({ page: "home" }, "Home", "/home");
	}
}

async function load_pong() {
	const body = document.getElementById("body");
	var content = await new Template("frontend/html/pages/pong.html").load();

	if (content == null)
		return console.error(ERROR_TEMPLATE);
	load_navbar();
	body.innerHTML = content.string;
	if (window.location.pathname !== "/pong") {
		history.pushState({ page: "pong" }, "Pong", "/pong");
	}
}

async function load_tictactoe() {
	const body = document.getElementById("body");
	var content = await new Template("frontend/html/pages/tictactoe.html").load();

	if (content == null)
		return console.error(ERROR_TEMPLATE);
	load_navbar();
	body.innerHTML = content.string;
	if (window.location.pathname !== "/tictactoe") {
		history.pushState({ page: "tictactoe" }, "TicTacToe", "/tictactoe");
	}
}

async function load_about() {
	const body = document.getElementById("body");
	var content = await new Template("frontend/html/pages/about.html").load();

	if (content == null)
		return console.error(ERROR_TEMPLATE);
	load_navbar();
	body.innerHTML = content.string;
	if (window.location.pathname !== "/about") {
		history.pushState({ page: "about" }, "About", "/about");
	}
}

async function load_signin() {
	const body = document.getElementById("body");
	var content = await new Template("frontend/html/pages/signin.html").load();

	if (content == null)
		return console.error(ERROR_TEMPLATE);
	load_navbar();
	body.innerHTML = content.string;
	if (window.location.pathname !== "/signin") {
		history.pushState({ page: "signin" }, "Signin", "/signin");
	}
}

async function load_signup() {
	const body = document.getElementById("body");
	var content = await new Template("frontend/html/pages/signup.html").load();

	if (content == null)
		return console.error(ERROR_TEMPLATE);
	load_navbar();
	body.innerHTML = content.string;
	if (window.location.pathname !== "/signup") {
		history.pushState({ page: "signup" }, "Signup", "/signup");
	}
}

window.onpopstate = async function (event) {
	if (event.state)
	{
		const page = event.state.page;
		switch (page)
		{
			case "home":
				await load_home(); break;
			case "pong":
				await load_pong(); break;
			case "tictactoe":
				await load_tictactoe(); break;
			case "about":
				await load_about(); break;
			case "signin":
				await load_signin(); break;
			case "signup":
				await load_signup(); break;
			default:
				console.error("Page not found:", page); break;
		}
	}
};
