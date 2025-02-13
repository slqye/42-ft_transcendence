async function	update_player_number()
{
	const select = document.getElementById("player_number_select");
	const player_number = parseInt(Array.from(select.selectedOptions).map(option => option.value), 10);
	const container = document.getElementById("players_input_container");
	const template = await new Template("frontend/html/pages/player_input.html").load();

	if (player_number !== 4 && player_number !== 8 && player_number !== 16)
	{
		new Toast(Toast.ERROR, "Invalid number of players.");
		return ;
	}
	if (template == null)
		return (console.error(ERROR_TEMPLATE));
	container.innerHTML = "";
	for (let index = 0; index < player_number; index++)
	{
		container.innerHTML += template.value;
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
		new Toast(Toast.ERROR, "Please enter a tournament name.");
		return ;
	}
	const select_game = document.getElementById("select_game");
	let is_pong = false;
	if (select_game.value != "0" && select_game.value != "1")
	{
		new Toast(Toast.ERROR, "Please select a valid game.");
		return ;
	}
	else
		is_pong = select_game.value == "1" ? true : false;
	const usernames = document.querySelectorAll("#players_input_container input");
	let usernames_list = [];
	for (let index = 0; index < usernames.length; index++)
		usernames_list.push(usernames[index].value);
	for (let index = 0; index < usernames_list.length; index++)
	{
		if (usernames_list[index] == "")
		{
			new Toast(Toast.ERROR, "Please enter all usernames.");
			return ;
		}
		for (let index2 = 0; index2 < usernames_list.length; index2++)
		{
			if (usernames_list[index] == usernames_list[index2] && index != index2)
			{
				new Toast(Toast.ERROR, "Please enter unique usernames.");
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
			new Toast(Toast.SUCCESS, "Tournament created successfully.");
		}
	}
	catch (error)
	{
		new Toast(Toast.ERROR, error.message);
		return ;
	}
	if (tournament_id == -1)
		return ;
	load_tournament(tournament_id);
}

async function	start_game_tournament()
{
	const url_params = new URLSearchParams(window.location.search);
	const tournament_id = url_params.get('id');
	if (!tournament_id)
		return (new Toast(Toast.ERROR, "Tournament ID is missing."));
	const request = await new Api("/api/tournaments/" + tournament_id + "/pairs/next/", Api.USER).set_method("GET").set_credentials("omit").request();
	if (request.status == Api.ERROR || request.response == null)
		throw (new Error(request.log));
	const next_pair = request.response.next_pair;
	if (next_pair == null)
		throw (new Error("No more matches in this tournament"));
	const user_id = next_pair.user;
	const opponent_id = next_pair.opponent;
	const player_1 = await fetch_me();
	const player_2 = await fetch_opponent();
	if (player_1 == null || player_2 == null)
		return (new Toast(Toast.ERROR, "Failed to load the next match of this tournament"));
	if (player_1.id != user_id)
		return (new Toast(Toast.ERROR, player_1.username + " is not the first player of this tournament match, please check your credentials"));
	if (player_2.id != opponent_id)
		return (new Toast(Toast.ERROR, player_2.username + " is not the second player of this tournament match, please check your credentials"));
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

function	set_tournament_forms(user_data, opponent_data)
{
	document.getElementById("tournament_user_signin_username").value = user_data.username;
	document.getElementById("tournament_user_signin_username").disabled = true;
	document.getElementById("tournament_opponent_signin_username").value = opponent_data.username;
	document.getElementById("tournament_opponent_signin_username").disabled = true;
}

function	set_connected_tournament_user_form(userData)
{
	document.getElementById("tournament_user_signin_username").value = userData.username;

	document.getElementById("tournament_user_signin_username").disabled = true;
	document.getElementById("tournament_user_signin_password").disabled = true;

	document.getElementById("sign_in_as_tournament_user_button").classList.add('d-none');
	document.getElementById("sign_out_as_tournament_user_button").classList.remove('d-none');

	display_start_game_button_if_ready();
}

function	reset_tournament_user_form()
{
	document.getElementById("tournament_user_signin_password").value = "";
	document.getElementById("tournament_user_signin_password").disabled = false;

	document.getElementById("sign_in_as_tournament_user_button").classList.remove('d-none');
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
			new Toast(Toast.ERROR, "Failed to fetch player 1 data.");
		else
		{
			localStorage.setItem("user_authenticated", "true");
			new Toast(Toast.SUCCESS, "Player 1 logged-in!");
			set_connected_tournament_user_form(userData);
		}
	}
}

async function	tournament_user_signout()
{
	const request = await new Api("/api/user/logout/", Api.USER).set_method("POST").set_omit_refresh(true).request();
	if (request.status == Api.ERROR)
		new Toast(Toast.ERROR, request.log);
	else
	{
		localStorage.removeItem("user_authenticated");
		new Toast(Toast.SUCCESS, "Player 1 signed out!");
		reset_tournament_user_form();
	}
}

function	set_connected_tournament_opponent_form(opponentData)
{
	document.getElementById("tournament_opponent_signin_username").value = opponentData.username;

	document.getElementById("tournament_opponent_signin_username").disabled = true;
	document.getElementById("tournament_opponent_signin_password").disabled = true;

	document.getElementById("sign_in_as_tournament_opponent_button").classList.add('d-none');
	document.getElementById("sign_out_as_tournament_opponent_button").classList.remove('d-none');

	display_start_game_button_if_ready();
}

function	reset_tournament_opponent_form()
{
	document.getElementById("tournament_opponent_signin_password").value = "";
	document.getElementById("tournament_opponent_signin_password").disabled = false;

	document.getElementById("sign_in_as_tournament_opponent_button").classList.remove('d-none');
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
			new Toast(Toast.ERROR, "Failed to fetch player 2 data.");
		else
		{
			localStorage.setItem("opponent_authenticated", "true");
			new Toast(Toast.SUCCESS, "Player 2 logged-in!");
			set_connected_tournament_opponent_form(opponentData);
		}
	}
}

async function	tournament_opponent_signout()
{
	const request = await new Api("/api/opponent/logout/", Api.OPPONENT).set_method("POST").set_omit_refresh(true).request();
	if (request.status == Api.ERROR)
		new Toast(Toast.ERROR, request.log);
	else
	{
		localStorage.removeItem("opponent_authenticated");
		new Toast(Toast.SUCCESS, "Player 2 signed out!");
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