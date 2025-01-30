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
	if (await Api.is_login())
	{
		try
		{
			const data = await fetch_me();
			navbar.edit.id.set.attribute("img-profile-icon", "src", data.avatar_url);
			navbar.edit.id.set.attribute("signin", "class", "nav-item d-none");
			navbar.edit.id.set.attribute("profile", "class", "nav-item");
		}
		catch (error)
		{
			new Toast(Toast.ERROR, error);
		}
	}
	header.innerHTML = navbar.string;
}

async function load_home() {
	const content = document.getElementById("content");
	let template = await new Template("frontend/html/pages/home.html").load();
	const urlParams = new URLSearchParams(window.location.search);
	const token = urlParams.get('token');

	if (template == null)
		return console.error(ERROR_TEMPLATE);
	if (window.location.pathname === "/home" && token)
		signin_42_callback();
	load_navbar();
	content.innerHTML = template.string;
	if (window.location.pathname !== "/home")
		history.pushState({ page: "home" }, "Home", "/home");
	init_tooltips();
}

async function load_pong() {
	if (!await Api.is_login())
		return (load_home());
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

async function load_start_game_tictactoe() {
	if (!await Api.is_login())
		return (load_home());
	const content = document.getElementById("content");
	let template = await new Template("frontend/html/pages/start_game_tictactoe.html").load();

	if (template == null)
		return console.error(ERROR_TEMPLATE);
	load_navbar();
	content.innerHTML = template.string;
	if (window.location.pathname !== "/start_game_tictactoe")
		history.pushState({ page: "start_game_tictactoe" }, "Start Game TicTacToe", "/start_game_tictactoe");
	init_tooltips();
	launch("start_game_tictactoe");
}

async function load_tictactoe() {
	if (!await Api.is_login())
		return (load_home());
	const content = document.getElementById("content");
	let template = await new Template("frontend/html/pages/tictactoe.html").load();

	if (template == null)
		return console.error(ERROR_TEMPLATE);
	load_navbar();
	content.innerHTML = template.string;
	if (window.location.pathname !== "/tictactoe")
		history.pushState({ page: "tictactoe" }, "TicTacToe", "/tictactoe");
	init_tooltips();
	launch("tictactoe");
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

	// Adapt the 42 logo based on the current theme
	const theme = document.body.getAttribute("data-bs-theme");
	const logo = document.getElementById("logo_42");
	const signin_42_btn = document.getElementById("signin_42");

	if (theme === "dark")
	{
		if (logo)
			logo.src = "/frontend/assets/42logo_dark.svg";
		if (signin_42_btn)
		{
			signin_42_btn.classList.remove("btn-outline-dark");
			signin_42_btn.classList.add("btn-outline-light");
		}
	}
	else
	{
		if (logo)
			logo.src = "/frontend/assets/42logo_light.svg";
		if (signin_42_btn)
		{
			signin_42_btn.classList.remove("btn-outline-light");
			signin_42_btn.classList.add("btn-outline-dark");
		}
	}

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

async function load_profile() {
	if (!await Api.is_login())
		return (load_home());
	const content = document.getElementById("content");
	let template = await new Template("frontend/html/pages/profile.html").load();

	if (template == null)
		return console.error(ERROR_TEMPLATE);
	load_navbar();
	set_profile(template);
	set_profile_history(template);
	content.innerHTML = template.string;
	if (window.location.pathname !== "/profile")
		history.pushState({ page: "profile" }, "Profile", "/profile");
	init_tooltips();
}

async function load_settings() {
	if (!await Api.is_login())
		return (load_home());
	const content = document.getElementById("content");
	let template = await new Template("frontend/html/pages/settings.html").load();

	if (template == null)
		return console.error(ERROR_TEMPLATE);
	load_navbar();
	content.innerHTML = template.string;
	if (window.location.pathname !== "/settings")
		history.pushState({ page: "settings" }, "Settings", "/settings");
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
			case "start_game_tictactoe":
				await load_start_game_tictactoe(); break;
			case "tictactoe":
				await load_tictactoe(); break;
			case "about":
				await load_about(); break;
			case "signin":
				await load_signin(); break;
			case "signup":
				await load_signup(); break;
			case "profile":
				await load_profile(); break;
			case "settings":
				await load_settings(); break;
			default:
				console.error("Page not found:", page); break;
		}
	}
};
