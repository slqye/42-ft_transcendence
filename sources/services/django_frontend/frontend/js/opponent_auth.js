async function opponent_signin(event) {
	event.preventDefault();
	const username = document.getElementById("opponent_signin_username").value;
	const password = document.getElementById("opponent_signin_password").value;

	try {
		const response = await fetch("/api/opponent/login/", {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				"username": username,
				"password": password,
			}),
		});

		if (!response.ok)
			throw new Error(response.statusText);

		const data = await response.json();

		const opponentData = await fetch_opponent();
		if (opponentData) {
			document.getElementById("opponent_icon_display").src = opponentData.avatar_url;
		} else {
			throw new Error("Failed to fetch opponent's avatar.");
		}
		new Toast(Toast.SUCCESS, "Opponent logged-in!");

		// Disable the opponent sign-in inputs
		document.getElementById("opponent_signin_username").disabled = true;
		document.getElementById("opponent_signin_password").disabled = true;

		// Update UI to show opponent avatar and logout button
		document.getElementById("sign_in_as_opponent_button").classList.add('d-none');
		document.getElementById("opponent_info").classList.remove('d-none');

		document.getElementById("start-game-tictactoe").classList.remove('d-none');

		// Fetch opponent's avatar
	} catch (error) {
		new Toast(Toast.ERROR, error);
	}
}

function opponent_signout() {
	fetch("/api/opponent/logout/", {
		method: "POST",
		credentials: 'include',
	})
	.then(response => {
		if (!response.ok) {
			throw new Error("Failed to sign out opponent.");
		}
		new Toast(Toast.SUCCESS, "Opponent signed out!");

		if (window.location.pathname === "/start_game_pong" || window.location.pathname === "/start_game_tictactoe")
		{
			document.getElementById("opponent_signin_username").disabled = false;
			document.getElementById("opponent_signin_password").disabled = false;

			document.getElementById("sign_in_as_opponent_button").classList.remove('d-none');
			document.getElementById("opponent_info").classList.add('d-none');
			document.getElementById("opponent_icon_display").src = "/frontend/assets/default_profile_icon.webp";

			document.getElementById("opponent_signin_username").value = "";
			document.getElementById("opponent_signin_password").value = "";

			document.getElementById("start-game-tictactoe").classList.add('d-none');
		}
	})
	.catch(error => {
		console.error(error);
		new Toast(Toast.ERROR, "Failed to sign out opponent.");
	});
}

async function	isOpponentLogin()
{
	const data = await fetch_opponent();
	if (!data)
		return false;
	return true;
}