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
		return (console.error(ERROR_TEMPLATE));
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
			if (!data)
				throw new Error("Failed to fetch user data");
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
	const callback = urlParams.get('callback');

	if (template == null)
		return (console.error(ERROR_TEMPLATE));
	if (window.location.pathname === "/home" && callback)
		await signin_42_callback();
	load_navbar();
	if (await Api.is_login())
		template.edit.id.add.attribute("sign-in-button", "class", "d-none");
	content.innerHTML = template.value;
	if (window.location.pathname !== "/home")
		history.pushState({ page: "home" }, "Home", "/home");
	init_tooltips();
}

async function load_create_game_pong() {
	if (!await Api.is_login())
		return (load_home());
	const content = document.getElementById("content");
	let template = await new Template("frontend/html/pages/create_game_pong.html").load();

	if (template == null)
		return (console.error(ERROR_TEMPLATE));
	load_navbar();
	content.innerHTML = template.value;
	if (window.location.pathname !== "/create_game_pong")
		history.pushState({ page: "create_game_pong" }, "Create a Pong game!", "/create_game_pong");
	init_tooltips();
	const opponent_authenticated = await Api.is_opponent_login();
	if (opponent_authenticated)
	{
		const opponentData = await fetch_opponent();
		if (opponentData)
			set_connected_opponent_form(opponentData);
	}
}

async function load_pong_match() {
	if (!await Api.is_login())
		return (load_home());
	const content = document.getElementById("content");
	let template = await new Template("frontend/html/pages/match_pong.html").load();

	if (template == null)
		return (console.error(ERROR_TEMPLATE));
	load_navbar();
	content.innerHTML = template.value;
	if (window.location.pathname !== "/match_pong")
		history.pushState({ page: "match_pong" }, "Pong Match!", "/match_pong");
	init_tooltips();
}

async function load_create_game_tictactoe() {
	if (!await Api.is_login())
		return (load_home());
	const content = document.getElementById("content");
	let template = await new Template("frontend/html/pages/create_game_tictactoe.html").load();

	if (template == null)
		return (console.error(ERROR_TEMPLATE));
	load_navbar();
	content.innerHTML = template.value;
	if (window.location.pathname !== "/create_game_tictactoe")
		history.pushState({ page: "create_game_tictactoe" }, "Create a TicTacToe game!", "/create_game_tictactoe");
	init_tooltips();
	const opponent_authenticated = await Api.is_opponent_login();
	if (opponent_authenticated)
	{
		const opponentData = await fetch_opponent();
		if (opponentData)
			set_connected_opponent_form(opponentData);
	}
}

async function load_tictactoe_match() {
	if (!await Api.is_login())
		return (load_home());
	const content = document.getElementById("content");
	let template = await new Template("frontend/html/pages/match_tictactoe.html").load();

	if (template == null)
		return (console.error(ERROR_TEMPLATE));
	load_navbar();
	content.innerHTML = template.value;
	if (window.location.pathname !== "/match_tictactoe")
		history.pushState({ page: "match_tictactoe" }, "TicTacToe Match!", "/match_tictactoe");
	init_tooltips();
}

async function load_tournament() {
	const content = document.getElementById("content");
	let template = await new Template("frontend/html/pages/create_tournament.html").load();

	if (template == null)
		return (console.error(ERROR_TEMPLATE));
	load_navbar();
	content.innerHTML = template.value;
	if (window.location.pathname !== "/create_tournament")
		history.pushState({ page: "create_tournament" }, "Create a Tournament", "/create_tournament");
	init_tooltips();
	update_player_number();
}

async function load_about() {
	const content = document.getElementById("content");
	let template = await new Template("frontend/html/pages/about.html").load();

	if (template == null)
		return (console.error(ERROR_TEMPLATE));
	load_navbar();
	content.innerHTML = template.value;
	if (window.location.pathname !== "/about")
		history.pushState({ page: "about" }, "About", "/about");
	init_tooltips();
}

async function load_signin() {
	if (await Api.is_login())
	{
		new Toast(Toast.WARNING, "You are already logged in!");
		return ;
	}
	const content = document.getElementById("content");
	let template = await new Template("frontend/html/pages/signin.html").load();

	if (template == null)
		return (console.error(ERROR_TEMPLATE));
	
	load_navbar();
	content.innerHTML = template.value;

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
		return (console.error(ERROR_TEMPLATE));
	load_navbar();
	content.innerHTML = template.value;
	if (window.location.pathname !== "/signup")
		history.pushState({ page: "signup" }, "Signup", "/signup");
	init_tooltips();
}

async function load_profile(pk = "me") {
	if (pk === "me" && !await Api.is_login())
		return (load_home());
	const content = document.getElementById("content");
	let template = await new Template("frontend/html/pages/profile.html").load();

	if (template == null)
		return (console.error(ERROR_TEMPLATE));
	load_navbar();
	await set_profile(template, pk);
	await set_profile_history(template, pk);
	template.update();
	content.innerHTML = template.string;
	if (pk === "me" && window.location.pathname !== "/profile")
		history.pushState({ page: "profile" }, "Profile", "/profile");
	else if (pk !== "me" && window.location.pathname !== "/profile/" + pk)
		history.pushState({ page: "profile", pk: pk }, "Profile", "/profile/" + pk);
	init_tooltips();
}

async function load_friends() {
	if (!await Api.is_login())
		return (load_home());
	const content = document.getElementById("content");
	let template = await new Template("frontend/html/pages/friends.html").load();

	if (template == null)
		return (console.error(ERROR_TEMPLATE));
	load_navbar();
	await set_friend_list(template);
	content.innerHTML = template.value;
	if (window.location.pathname !== "/friends")
		history.pushState({ page: "friends" }, "Friends", "/friends");
	init_tooltips();
}

async function load_settings() {
	if (!await Api.is_login())
		return (load_home());
	const content = document.getElementById("content");
	let template = await new Template("frontend/html/pages/settings.html").load();

	if (template == null)
		return (console.error(ERROR_TEMPLATE));
	load_navbar();
	content.innerHTML = template.value;
	if (window.location.pathname !== "/settings")
		history.pushState({ page: "settings" }, "Settings", "/settings");
	init_tooltips();
}

// async function load_tournament(tournament_id) {
// 	const content = document.getElementById("content");
// 	let template = await new Template("frontend/html/pages/tournament.html").load();
	
// 	if (template == null)
// 		return (console.error(ERROR_TEMPLATE));
// 	load_navbar();
// 	content.innerHTML = template.value;
// 	if (window.location.pathname !== "/tournament/" + tournament_id)
// 		history.pushState({ page: "tournament", tournament_id: tournament_id }, "Tournament", "/tournament/" + tournament_id); //TODO: change the name to the tournament name
// 	init_tooltips();
// }

window.onpopstate = async function (event) {
	if (event.state)
	{
		const page = event.state.page;
		if (page.startsWith("profile/"))
		{
			await load_profile(page.split("/")[1]);
			return ;
		}
		switch (page)
		{
			case "home":
				await load_home(); break;
			case "create_game_pong":
				await load_create_game_pong(); break;
			case "match_pong":
				await load_pong_match(); break;
			case "create_game_tictactoe":
				await load_create_game_tictactoe(); break;
			case "match_tictactoe":
				await load_tictactoe_match(); break;
			case "about":
				await load_about(); break;
			case "signin":
				await load_signin(); break;
			case "signup":
				await load_signup(); break;
			case "profile":
				await load_profile(); break;
			case "friends":
				await load_friends(); break;
			case "settings":
				await load_settings(); break;
			case "tournament":
				await load_tournament(); break;
			default:
				console.error("Page not found:", page); break;
		}
	}
};
