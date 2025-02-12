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
	console.log("Tournament ID : " + tournament_id);
}