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
		return (new Toast(Toast.ERROR, str_template_error()));
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
				throw new Error(str_failed_to_fetch_user_data());
			navbar.edit.id.set.attribute("img-profile-icon", "src", data.avatar_url);
			navbar.edit.id.set.attribute("signin", "class", "nav-item d-none");
			navbar.edit.id.set.attribute("profile", "class", "nav-item");
			navbar.edit.id.set.attribute("games", "class", "nav-item dropdown");
		}
		catch (error)
		{
			new Toast(Toast.ERROR, error);
		}
	}
	if ((window.location.pathname === "/home" || window.location.pathname === "/about") && await Api.is_opponent_login())
	{
		navbar.edit.id.set.attribute("signout_opponent_container", "class", "nav-item");
	}
	header.innerHTML = navbar.string;
}

async function load_home() {
	const content = document.getElementById("content");
	let template = await new Template("frontend/html/pages/home.html").load();
	const urlParams = new URLSearchParams(window.location.search);
	const callback = urlParams.get('callback');
	const role = urlParams.get('role');
	const type = urlParams.get('type');
	const success_callback = urlParams.get('success_callback');

	if (template == null)
		return (new Toast(Toast.ERROR, str_template_error()));
	if (window.location.pathname === "/home" && callback)
		await signin_42_callback(role === "opponent", type, success_callback === "true");
	if (callback && type == "match_pong")
		return (await load_create_game_pong());
	else if (callback && type == "match_tictactoe")
		return (await load_create_game_tictactoe());
	else if (callback && type == "tournament")
		return (await select_tournament());
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
		return (new Toast(Toast.ERROR, str_template_error()));
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
	set_theme_signin42();
}

async function load_pong_match() {
	if (!await Api.is_login())
		return (load_home());
	const content = document.getElementById("content");
	let template = await new Template("frontend/html/pages/match_pong.html").load();

	if (template == null)
		return (new Toast(Toast.ERROR, str_template_error()));
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
		return (new Toast(Toast.ERROR, str_template_error()));
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
	set_theme_signin42();
}

async function load_tictactoe_match() {
	if (!await Api.is_login())
		return (load_home());
	const content = document.getElementById("content");
	let template = await new Template("frontend/html/pages/match_tictactoe.html").load();

	if (template == null)
		return (new Toast(Toast.ERROR, str_template_error()));
	load_navbar();
	content.innerHTML = template.value;
	if (window.location.pathname !== "/match_tictactoe")
		history.pushState({ page: "match_tictactoe" }, "TicTacToe Match!", "/match_tictactoe");
	init_tooltips();
}

async function load_create_tournament() {
	const content = document.getElementById("content");
	let template = await new Template("frontend/html/pages/create_tournament.html").load();

	if (template == null)
		return (new Toast(Toast.ERROR, str_template_error()));
	load_navbar();
	content.innerHTML = template.value;
	if (window.location.pathname !== "/create_tournament")
		history.pushState({ page: "create_tournament" }, "Create a Tournament", "/create_tournament");
	init_tooltips();
	await update_player_number();
}

async function load_about() {
	const content = document.getElementById("content");
	let template = await new Template("frontend/html/pages/about.html").load();

	if (template == null)
		return (new Toast(Toast.ERROR, str_template_error()));
	load_navbar();
	content.innerHTML = template.value;
	if (window.location.pathname !== "/about")
		history.pushState({ page: "about" }, "About", "/about");
	init_tooltips();
}

async function load_signin() {
	if (await Api.is_login())
	{
		new Toast(Toast.WARNING, str_already_logged_in());
		return ;
	}
	const content = document.getElementById("content");
	let template = await new Template("frontend/html/pages/signin.html").load();

	if (template == null)
		return (new Toast(Toast.ERROR, str_template_error()));
	
	load_navbar();
	content.innerHTML = template.value;
	set_theme_signin42();

	if (window.location.pathname !== "/signin")
		history.pushState({ page: "signin" }, "Signin", "/signin");
	
	init_tooltips();
}

async function load_signup() {
	const content = document.getElementById("content");
	let template = await new Template("frontend/html/pages/signup.html").load();

	if (template == null)
		return (new Toast(Toast.ERROR, str_template_error()));
	load_navbar();
	content.innerHTML = template.value;
	if (window.location.pathname !== "/signup")
		history.pushState({ page: "signup" }, "Signup", "/signup");
	init_tooltips();
}

async function load_profile(pk) {
	let idParam = null;
	if (pk !== "me")
	{
		history.pushState({ page: "profile", id: pk }, "Profile", "/profile?id=" + pk);
		const urlParams = new URLSearchParams(window.location.search);
		idParam = urlParams.get('id');
	}
	else
	{
		if (!await Api.is_login())
			return (load_home());
		history.pushState({ page: "profile" }, "Profile", "/profile");
		idParam = "me";
	}
	const content = document.getElementById("content");
	let template = await new Template("frontend/html/pages/profile.html").load();

	if (template == null)
		return (new Toast(Toast.ERROR, str_template_error()));
	load_navbar();
	await set_profile(template, pk);
	await set_profile_history(template, pk);
	await set_profile_tournament_history(template, pk);
	template.update();
	content.innerHTML = template.string;
	init_tooltips();
}

async function load_friends() {
	if (!await Api.is_login())
		return (load_home());
	const content = document.getElementById("content");
	let template = await new Template("frontend/html/pages/friends.html").load();

	if (template == null)
		return (new Toast(Toast.ERROR, str_template_error()));
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
		return (new Toast(Toast.ERROR, str_template_error()));
	load_navbar();
	content.innerHTML = template.value;
	if (window.location.pathname !== "/settings")
		history.pushState({ page: "settings" }, "Settings", "/settings");
	init_tooltips();
}

async function load_tournament(pk)
{
	if (pk != -1)
	{
		history.pushState({ page: "tournament", id: pk }, "Tournament", "/tournament?id=" + pk);
		const urlParams = new URLSearchParams(window.location.search);
		pk = urlParams.get('id');
		localStorage.setItem("tournament_id", pk);
	}
	else
	{
		load_home();
		return ;
	}
	const content = document.getElementById("content");
	const request = await new Api("/api/tournaments/" + pk + "/", Api.USER).set_method("GET").set_credentials("omit").request();
	if (request.status != Api.SUCCESS)
		return (new Toast(Toast.ERROR, str_failed_to_load_tournament()));
	const tournament = request.response;
	let template = null;
	if (tournament.is_done)
	{
		if (localStorage.getItem("tournament_id") != null)
			localStorage.removeItem("tournament_id");
		return (await load_tournament_details(pk));
	}
	else
	{
		const request = await new Api("/api/tournaments/" + pk + "/pairs/next/", Api.USER).set_method("GET").set_credentials("omit").request();
		if (request.status != Api.SUCCESS)
			return (new Toast(Toast.ERROR, str_failed_to_load_next_match_of_this_tournament()));
		const next_pair = request.response.next_pair;
		if (next_pair == null)
			return (new Toast(Toast.WARNING, str_no_more_matches_in_this_tournament()));
		const user_id = next_pair.user;
		const opponent_id = next_pair.opponent;
		const user_data = await fetch_user(user_id);
		const opponent_data = await fetch_user(opponent_id);
		if (user_data == null || opponent_data == null)
			return (new Toast(Toast.ERROR, str_failed_to_load_next_match_of_this_tournament()));
		let user_signed_in = false;
		let opponent_signed_in = false;
		if (await Api.is_login())
		{
			const signed_in_user = await fetch_me();
			if (signed_in_user.username !== user_data.username)
				await tournament_user_signout(false, true);
			else
				user_signed_in = true;
		}
		if (await Api.is_opponent_login())
		{
			const signed_in_opponent = await fetch_opponent();
			if (signed_in_opponent.username !== opponent_data.username)
				await tournament_opponent_signout(false, true);
			else
				opponent_signed_in = true;
		}
		template = await new Template("frontend/html/pages/tournament_login.html").load();
		if (template == null)
			return (new Toast(Toast.ERROR, str_template_error()));
		load_navbar();
		history.pushState({ page: "tournament", id: pk }, "Tournament", "/tournament?id=" + pk);
		content.innerHTML = template.value;
		const tournament_name_title = str_tournament_name_title(tournament)
		document.getElementById("tournament_name").innerHTML = tournament_name_title;
		set_theme_signin42();
		set_tournament_forms(user_data, opponent_data, user_signed_in, opponent_signed_in);
	}
	init_tooltips();
}

async function load_tournament_details(pk = -1)
{
	if (pk != -1)
	{
		history.pushState({ page: "tournament_details", id: pk }, "Tournament details", "/tournament_details?id=" + pk);
		const urlParams = new URLSearchParams(window.location.search);
		pk = urlParams.get('id');
	}
	else
	{
		load_home();
		return ;
	}
	const content = document.getElementById("content");
	const request = await new Api("/api/tournaments/" + pk + "/", Api.USER).set_method("GET").set_credentials("omit").request();
	if (request.status != Api.SUCCESS)
		return (new Toast(Toast.ERROR, str_failed_to_load_tournament_details_from_server()));
	let template = await new Template("frontend/html/pages/tournament_details.html").load();
	if (template == null)
		return (new Toast(Toast.ERROR, str_template_error()));
	history.pushState({ page: "tournament_details", id: pk }, "Tournament details", "/tournament_details?id=" + pk);
	load_navbar();
	await set_tournament_details(template, request.response);
	template.update();
	content.innerHTML = template.string;
	init_tooltips();
}

window.onpopstate = async function (event) {
	if (event.state)
	{
		const page = event.state.page;
		if (page.startsWith("profile"))
		{
			const profileId = event.state.id || "me";
			await load_profile(profileId);
			return ;
		}
		if (page.startsWith("tournament_details"))
		{
			const tournamentId = event.state.tournament_id || -1;
			await load_tournament_details(tournamentId);
			return ;
		}
		if (page.startsWith("tournament"))
		{
			const tournamentId = event.state.tournament_id || -1;
			await load_tournament(tournamentId);
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
			case "tournament_details":
				await load_tournament_details(); break;
			case "create_tournament":
				await load_create_tournament(); break;
			default:
				return (new Toast(Toast.ERROR, str_page_not_found()));
		}
	}
};
