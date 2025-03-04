async function	update_player_number()
{
	const select = document.getElementById("player_number_select");
	const player_number = parseInt(select.value, 10);
	const container = document.getElementById("players_input_container");
	const template = await new Template("frontend/html/pages/player_input.html").load();

	if (player_number !== 4 && player_number !== 8 && player_number !== 16)
	{
		new Toast(Toast.ERROR, str_invalid_number_of_players());
		return ;
	}
	if (template == null)
		return (new Toast(Toast.ERROR, str_template_error()));
	container.innerHTML = "";
	for (let i = 0; i < player_number; i++)
	{
		// Create a document fragment from the template's HTML
		const fragment = document.createRange().createContextualFragment(template.value);
		const inputField = fragment.querySelector("input");
		if (inputField) {
			inputField.id = `player_input_${i}`;
		}
		container.appendChild(fragment);
	}
}

/*
Tournament flow :
- User enters all usernames
- Front checks if all usernames exist with POST /api/users/list/username/ with body {"usernames" : ["username1", "username2", ...]}, it gives back the list of users ids {"users_ids" : [1, 2, ...]}
- Front sends a request to create tournament with POST /api/tournaments/
Loop until all matches are played :
- Front fetches next tournament pair with GET /api/tournaments/{pk}/next_pair/
- Both players connects like usual
- Once the match is finished, the match is created with POST /api/invitations/ and POST /api/invitations/{id}/accept/
- Once created, the match is linked to the tournament with PUT /api/tournaments/{pk}/ with body {"match_id": 15} which front just got from match creation
*/

async function	create_tournament()
{
	const tournament_name = document.getElementById("tournament_name").value;
	if (tournament_name == "")
	{
		new Toast(Toast.ERROR, str_please_enter_a_tournament_name());
		return ;
	}
	const select_game = document.getElementById("select_game");
	let is_pong = false;
	if (select_game.value != "0" && select_game.value != "1")
	{
		new Toast(Toast.ERROR, str_please_select_a_valid_game());
		return ;
	}
	else
		is_pong = select_game.value == "1" ? true : false;
	const usernames = document.querySelectorAll("#players_input_container .player_input");
	let usernames_list = [];
	for (let index = 0; index < usernames.length; index++)
		usernames_list.push(usernames[index].value);
	for (let index = 0; index < usernames_list.length; index++)
	{
		if (usernames_list[index] == "")
		{
			new Toast(Toast.ERROR, str_please_enter_all_usernames());
			return ;
		}
		for (let index2 = 0; index2 < usernames_list.length; index2++)
		{
			if (usernames_list[index] == usernames_list[index2] && index != index2)
			{
				new Toast(Toast.ERROR, str_please_enter_unique_usernames());
				return ;
			}
		}
	}	
	const request_body_usernames = JSON.stringify({
		"usernames" : usernames_list
	});
	let user_ids = [];
	try
	{
		const request = await new Api("/api/users/list/username/", Api.USER).set_method("POST").set_credentials("omit").set_body(request_body_usernames).request();
		if (request.status == Api.ERROR && request.code == 404)
		{
			let not_found_usernames = request.response.usernames;
			let error_message = request.log + " :";
			for (let index = 0; index < not_found_usernames.length; index++)
				error_message += `<br/>- ${not_found_usernames[index]}`;
			throw (new Error(error_message));
		}
		else if (request.status == Api.ERROR)
		{
			throw (new Error(request.log));
		}
		else
		{
			user_ids = request.response.user_ids;
		}
	}
	catch (error)
	{
		new Toast(Toast.ERROR, error.message);
		return ;
	}
	const request_body_tournament = JSON.stringify({
		"name" : tournament_name,
		"is_pong" : is_pong,
		"participant_ids" : user_ids
	});
	let tournament_id = -1;
	try
	{
		const request = await new Api("/api/tournaments/", Api.USER).set_method("POST").set_credentials("omit").set_body(request_body_tournament).request();
		if (request.status == Api.ERROR)
			throw (new Error(request.log));
		else
		{
			tournament_id = request.response.id;
			new Toast(Toast.SUCCESS, str_tournament_created_successfully());
		}
	}
	catch (error)
	{
		new Toast(Toast.ERROR, error.message);
		return ;
	}
	if (tournament_id == -1)
		return ;
	await load_tournament(tournament_id);
}

async function	start_game_tournament()
{
	const url_params = new URLSearchParams(window.location.search);
	const tournament_id = url_params.get('id');
	if (!tournament_id)
		return (new Toast(Toast.ERROR, str_tournament_id_is_missing()));
	const request = await new Api("/api/tournaments/" + tournament_id + "/pairs/next/", Api.USER).set_method("GET").set_credentials("omit").request();
	if (request.status == Api.ERROR || request.response == null)
		throw (new Error(request.log));
	const next_pair = request.response.next_pair;
	if (next_pair == null)
		throw (new Error(str_no_more_matches_in_this_tournament()));
	const user_id = next_pair.user;
	const opponent_id = next_pair.opponent;
	const player_1 = await fetch_me();
	const player_2 = await fetch_opponent();
	if (player_1 == null || player_2 == null)
		return (new Toast(Toast.ERROR, str_failed_to_load_next_match_of_this_tournament()));
	if (player_1.id != user_id)
		return (new Toast(Toast.ERROR, player_1.username + " " + str_is_not_the_first_player_of_this_tournament_match_please_check_your_credentials()));
	if (player_2.id != opponent_id)
		return (new Toast(Toast.ERROR, player_2.username + " " + str_is_not_the_second_player_of_this_tournament_match_please_check_your_credentials()));
	if (next_pair.is_pong)
	{
		await load_pong_match();
		let game = document.getElementById("game");
		let score = document.getElementById("score");
		var pong = new Pong(game, score, new Player(player_1.display_name), new Player(player_2.display_name), 3, tournament_id);
		pong.init();
	}
	else
	{
		await load_tictactoe_match();
		var game = new TicTacToe(new Player(player_1.display_name), new Player(player_2.display_name), 3, tournament_id);
		game.init();
	}
}

function	set_tournament_forms(user_data, opponent_data, user_signed_in, opponent_signed_in)
{
	document.getElementById("tournament_user_signin_username").value = user_data.username;
	document.getElementById("tournament_user_signin_username").disabled = true;
	document.getElementById("tournament_opponent_signin_username").value = opponent_data.username;
	document.getElementById("tournament_opponent_signin_username").disabled = true;
	if (user_signed_in)
		set_connected_tournament_user_form(user_data);
	if (opponent_signed_in)
		set_connected_tournament_opponent_form(opponent_data);
}

function	set_connected_tournament_user_form(userData)
{
	document.getElementById("tournament_user_signin_username").value = userData.username;

	document.getElementById("tournament_user_signin_username").disabled = true;
	document.getElementById("tournament_user_signin_password").disabled = true;

	document.getElementById("sign_in_user_options").classList.add('d-none');
	document.getElementById("sign_out_as_tournament_user_button").classList.remove('d-none');

	display_start_game_button_if_ready();
}

function	reset_tournament_user_form()
{
	document.getElementById("tournament_user_signin_password").value = "";
	document.getElementById("tournament_user_signin_password").disabled = false;

	document.getElementById("sign_in_user_options").classList.remove('d-none');
	document.getElementById("sign_out_as_tournament_user_button").classList.add('d-none');

	if (document.getElementById("start_game_button").classList.contains('d-none') == false)
		document.getElementById("start_game_button").classList.add('d-none');
}

async function	tournament_user_signin()
{
	const username = document.getElementById("tournament_user_signin_username").value;
	const password = document.getElementById("tournament_user_signin_password").value;
	const request_body = JSON.stringify({
		"username" : username,
		"password" : password
	});
	const request = await new Api("/api/user/login/", Api.USER).set_method("POST").set_body(request_body).set_omit_refresh(true).request();
	if (request.status == Api.ERROR)
		new Toast(Toast.ERROR, request.log);
	else
	{
		const userData = await fetch_me();
		if (!userData)
			new Toast(Toast.ERROR, str_failed_to_fetch_player_1_data());
		else
		{
			localStorage.setItem("user_authenticated", "true");
			new Toast(Toast.SUCCESS, str_player_1_logged_in());
			set_connected_tournament_user_form(userData);
		}
	}
}

async function	tournament_user_signout(reset_form = true, skip_toast = false)
{
	const request = await new Api("/api/user/logout/", Api.USER).set_method("POST").set_omit_refresh(true).request();
	if (request.status == Api.ERROR)
		new Toast(Toast.ERROR, request.log);
	else
	{
		localStorage.removeItem("user_authenticated");
		if (!skip_toast)
			new Toast(Toast.SUCCESS, str_player_1_signed_out());
		if (reset_form)
			reset_tournament_user_form();
	}
}

function	set_connected_tournament_opponent_form(opponentData)
{
	document.getElementById("tournament_opponent_signin_username").value = opponentData.username;

	document.getElementById("tournament_opponent_signin_username").disabled = true;
	document.getElementById("tournament_opponent_signin_password").disabled = true;

	document.getElementById("sign_in_opponent_options").classList.add('d-none');
	document.getElementById("sign_out_as_tournament_opponent_button").classList.remove('d-none');

	display_start_game_button_if_ready();
}

function	reset_tournament_opponent_form()
{
	document.getElementById("tournament_opponent_signin_password").value = "";
	document.getElementById("tournament_opponent_signin_password").disabled = false;

	document.getElementById("sign_in_opponent_options").classList.remove('d-none');
	document.getElementById("sign_out_as_tournament_opponent_button").classList.add('d-none');

	if (document.getElementById("start_game_button").classList.contains('d-none') == false)
		document.getElementById("start_game_button").classList.add('d-none');
}

async function	tournament_opponent_signin()
{
	const username = document.getElementById("tournament_opponent_signin_username").value;
	const password = document.getElementById("tournament_opponent_signin_password").value;
	const request_body = JSON.stringify({
		"username" : username,
		"password" : password
	});
	const request = await new Api("/api/opponent/login/", Api.OPPONENT).set_method("POST").set_body(request_body).set_omit_refresh(true).request();
	if (request.status == Api.ERROR)
		new Toast(Toast.ERROR, request.log);
	else
	{
		const opponentData = await fetch_opponent();
		if (!opponentData)
			new Toast(Toast.ERROR, str_failed_to_fetch_player_2_data());
		else
		{
			localStorage.setItem("opponent_authenticated", "true");
			new Toast(Toast.SUCCESS, str_player_2_logged_in());
			set_connected_tournament_opponent_form(opponentData);
		}
	}
}

async function	tournament_opponent_signout(reset_form = true, skip_toast = false)
{
	const request = await new Api("/api/opponent/logout/", Api.OPPONENT).set_method("POST").set_omit_refresh(true).request();
	if (request.status == Api.ERROR)
		new Toast(Toast.ERROR, request.log);
	else
	{
		localStorage.removeItem("opponent_authenticated");
		if (!skip_toast)
			new Toast(Toast.SUCCESS, str_player_2_signed_out());
		if (reset_form)
			reset_tournament_opponent_form();
	}
}

function	display_start_game_button_if_ready()
{
	const user_authenticated = localStorage.getItem("user_authenticated");
	const opponent_authenticated = localStorage.getItem("opponent_authenticated");
	if (user_authenticated && opponent_authenticated)
		document.getElementById("start_game_button").classList.remove('d-none');
}

async function	set_tournament_details(template, tournament)
{
	let tournament_name_title = str_tournament_name_title(tournament);

	template.edit.id.set.content("tournament_name", tournament_name_title);

	if (!tournament.is_done)
	{
		template.edit.id.set.content("tournament_status", str_tournament_is_still_in_progress());
		template.edit.id.get.element("tournament_status").classList.remove("d-none");
	}
	else
	{
		template.edit.id.get.element("rankings").classList.remove("d-none");
		participants_ranking_ids = tournament.participants_ranking;
		const rankings = template.edit.id.get.element("rankings");
		let ranking = 1;
		for (let index = participants_ranking_ids.length - 1; index >= 0; index--)
		{
			const player = participants_ranking_ids[index];
			let ranking_item_template = await new Template("frontend/html/pages/ranking_item.html").load();
			if (ranking_item_template == null)
				return (new Toast(Toast.ERROR, str_template_error()));
			ranking_item_template.edit.id.set.content("ranking_position", ranking++);
			ranking_item_template.edit.id.set.content("display_name", player.display_name);
			ranking_item_template.edit.id.set.content("username", "@" + player.username);
			ranking_item_template.edit.id.set.attribute("profile_icon_tournament", "src", player.avatar_url);
			rankings.appendChild(ranking_item_template.edit.id.get.element("ranking_item"));
		}
	}
}

async function	select_tournament()
{
	const tournament_id_str = localStorage.getItem("tournament_id");
	if (tournament_id_str == null)
		return (await load_create_tournament());
	const tournament_id = parseInt(tournament_id_str, 10);
	await load_tournament(tournament_id);
}