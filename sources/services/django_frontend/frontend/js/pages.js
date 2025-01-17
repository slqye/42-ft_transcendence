function	init_tooltips()
{
	const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
	const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

async function load_navbar() {
	const body = document.querySelector("body");
	const header = document.getElementById("header");
	let navbar = await new Template("frontend/html/navbar.html").load();
	let user_data;

	if (navbar == null)
		return console.error(ERROR_TEMPLATE);
	if (body.getAttribute("data-bs-theme") != "dark")
	{
		navbar.edit.id.set.attribute("theme_icon_sun", "class", "px-2 d-none d-lg-none");
		navbar.edit.id.set.attribute("theme_icon_moon", "class", "px-2 d-none d-lg-inline-block");
	}
	if (isLogin())
	{
		try
		{
			const response = await fetch("/api/users/me/", {
				method: "GET",
				headers:
				{
					"Authorization": `Token ${localStorage.getItem("auth-token")}`,
					"Content-Type": "application/json"
				}
			});
			if (!response.ok)
			{
				new Toast(Toast.ERROR, "A network error occurred.");
				throw new Error("A network error occurred.");
			}
			const data = await response.json();
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
