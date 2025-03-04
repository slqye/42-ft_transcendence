function	set_connected_opponent_form(opponentData)
{

	document.getElementById("opponent_signin_username").value = opponentData.username;

	document.getElementById("opponent_signin_username").disabled = true;
	document.getElementById("opponent_signin_password").disabled = true;

	document.getElementById("sign_in_opponent_options").classList.add('d-none');
	document.getElementById("opponent_info").classList.remove('d-none');

	document.getElementById("start-game-button").classList.remove('d-none');
}

function	reset_opponent_form()
{
	document.getElementById("opponent_signin_username").disabled = false;
	document.getElementById("opponent_signin_password").disabled = false;

	document.getElementById("sign_in_opponent_options").classList.remove('d-none');
	document.getElementById("opponent_info").classList.add('d-none');

	document.getElementById("opponent_signin_username").value = "";
	document.getElementById("opponent_signin_password").value = "";

	document.getElementById("start-game-button").classList.add('d-none');
}

async function opponent_signin() {
	const username = document.getElementById("opponent_signin_username").value;
	const password = document.getElementById("opponent_signin_password").value;

	const request_body = JSON.stringify(
	{
		"username": username,
		"password": password
	});
	const request = await new Api("/api/opponent/login/", Api.USER).set_method("POST").set_body(request_body).set_omit_refresh(true).request();
	if (request.status == Api.ERROR)
		new Toast(Toast.ERROR, request.log);
	else
	{
		const opponentData = await fetch_opponent();
		if (!opponentData)
			new Toast(Toast.ERROR, str_failed_to_fetch_opponent_data());
		else
		{
			localStorage.setItem("opponent_authenticated", "true");
			new Toast(Toast.SUCCESS, str_opponent_logged_in());
			if (window.location.pathname === "/create_game_pong" || window.location.pathname === "/create_game_tictactoe"	)
				set_connected_opponent_form(opponentData);
		}
	}
}

async function opponent_signout() {
	const request = await new Api("/api/opponent/logout/", Api.OPPONENT).set_method("POST").set_omit_refresh(true).request();
	if (request.status == Api.ERROR)
		new Toast(Toast.ERROR, request.log);
	else
	{
		localStorage.removeItem("opponent_authenticated");
		new Toast(Toast.SUCCESS, str_opponent_signed_out());
		if (window.location.pathname === "/create_game_pong" || window.location.pathname === "/create_game_tictactoe")
			reset_opponent_form();
	}
}