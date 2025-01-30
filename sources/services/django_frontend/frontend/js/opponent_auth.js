async function opponent_signin(event) {
	event.preventDefault();
	const username = document.getElementById("opponent_signin_username").value;
	const password = document.getElementById("opponent_signin_password").value;

	const request_body = JSON.stringify(
		{
			"username": username,
			"password": password
		});
	const request = await new Api("/api/opponent/login/", Api.USER).set_method("POST").set_body(request_body).request();
	if (request.status == Api.ERROR)
		new Toast(Toast.ERROR, request.log);
	else
	{
		const opponentData = await fetch_opponent();
		if (!opponentData)
			new Toast(Toast.ERROR, "Failed to fetch opponent's data.");
		else
		{
			localStorage.setItem("opponent_authenticated", "true");
			document.getElementById("opponent_icon_display").src = opponentData.avatar_url;
			new Toast(Toast.SUCCESS, "Opponent logged-in!");

			document.getElementById("opponent_signin_username").disabled = true;
			document.getElementById("opponent_signin_password").disabled = true;

			document.getElementById("sign_in_as_opponent_button").classList.add('d-none');
			document.getElementById("opponent_info").classList.remove('d-none');

			document.getElementById("start-game-button").classList.remove('d-none');
		}
	}
}

async function opponent_signout() {
	const request = await new Api("/api/opponent/logout/", Api.USER).set_method("POST").request();
	if (request.status == Api.ERROR)
		new Toast(Toast.ERROR, request.log);
	else
	{
		new Toast(Toast.SUCCESS, "Opponent signed out!");
		localStorage.removeItem("opponent_authenticated");

		if (window.location.pathname === "/start_game_pong" || window.location.pathname === "/start_game_tictactoe")
		{
			document.getElementById("opponent_signin_username").disabled = false;
			document.getElementById("opponent_signin_password").disabled = false;

			document.getElementById("sign_in_as_opponent_button").classList.remove('d-none');
			document.getElementById("opponent_info").classList.add('d-none');
			document.getElementById("opponent_icon_display").src = "/frontend/assets/default_profile_icon.webp";

			document.getElementById("opponent_signin_username").value = "";
			document.getElementById("opponent_signin_password").value = "";

			document.getElementById("start-game-button").classList.add('d-none');
		}
	}
}