function	init_tooltips()
{
	const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
	const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

async function load_navbar() {
	const body = document.querySelector("body");
	const header = document.getElementById("header");
	let navbar = await new Template("frontend/html/navbar.html").load();

	if (navbar == null)
		return console.error(ERROR_TEMPLATE);
	if (body.getAttribute("data-bs-theme") != "dark")
	{
		navbar.edit.id.set.attribute("theme_icon_sun", "class", "px-2 d-none d-lg-none");
		navbar.edit.id.set.attribute("theme_icon_moon", "class", "px-2 d-none d-lg-inline-block");
	}
	header.innerHTML = navbar.string;
}

async function load_home() {
	const content = document.getElementById("content");
	let template = await new Template("frontend/html/pages/home.html").load();

	if (template == null)
		return console.error(ERROR_TEMPLATE);
	load_navbar();
	content.innerHTML = template.string;
	if (window.location.pathname !== "/home")
		history.pushState({ page: "home" }, "Home", "/home");
	init_tooltips();
}

async function load_pong() {
	const content = document.getElementById("content");
	let template = await new Template("frontend/html/pages/pong.html").load();

	if (template == null)
		return console.error(ERROR_TEMPLATE);
	load_navbar();
	if (isMobile())
		template.edit.class.set.attributes("player-slider", "class", "player-slider col-12 d-flex m-1");
	content.innerHTML = template.string;
	if (window.location.pathname !== "/pong")
		history.pushState({ page: "pong" }, "Pong", "/pong");
	init_tooltips();
	launch("pong");
}

async function load_tictactoe() {
	const content = document.getElementById("content");
	let template = await new Template("frontend/html/pages/tictactoe.html").load();

	if (template == null)
		return console.error(ERROR_TEMPLATE);
	load_navbar();
	content.innerHTML = template.string;
	if (window.location.pathname !== "/tictactoe")
		history.pushState({ page: "tictactoe" }, "TicTacToe", "/tictactoe");
	init_tooltips();
}

async function load_about() {
	const content = document.getElementById("content");
	let template = await new Template("frontend/html/pages/about.html").load();

	if (template == null)
		return console.error(ERROR_TEMPLATE);
	load_navbar();
	content.innerHTML = template.string;
	if (window.location.pathname !== "/about")
		history.pushState({ page: "about" }, "About", "/about");
	init_tooltips();
}

async function load_signin() {
	const content = document.getElementById("content");
	let template = await new Template("frontend/html/pages/signin.html").load();

	if (template == null)
		return console.error(ERROR_TEMPLATE);
	load_navbar();
	content.innerHTML = template.string;
	if (window.location.pathname !== "/signin")
		history.pushState({ page: "signin" }, "Signin", "/signin");
	init_tooltips();
}

async function load_signup() {
	const content = document.getElementById("content");
	let template = await new Template("frontend/html/pages/signup.html").load();

	if (template == null)
		return console.error(ERROR_TEMPLATE);
	load_navbar();
	content.innerHTML = template.string;
	if (window.location.pathname !== "/signup")
		history.pushState({ page: "signup" }, "Signup", "/signup");
	init_tooltips();
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
