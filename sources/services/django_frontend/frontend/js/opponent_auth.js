
async function opponent_signin(event) {
	event.preventDefault();
	const username = document.getElementById("opponent_signin_username").value;
	const password = document.getElementById("opponent_signin_password").value;

	fetch("/api/token-auth/", {
		method: "POST",
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			"username": username,
			"password": password,
		}),
		credentials: 'include'
	})
	.then(response => {
		if (!response.ok)
			throw new Error(response.statusText);
		return response.json();
	})
	.then(data => {
		new Toast(Toast.SUCCESS, "Opponent logged-in!");

		// Disable the opponent sign-in inputs
		document.getElementById("opponent_signin_username").disabled = true;
		document.getElementById("opponent_signin_password").disabled = true;

		// Update UI to show opponent avatar and logout button
		document.getElementById("sign_in_as_opponent_button").classList.add('d-none');
		document.getElementById("opponent_info").classList.remove('d-none');

		// Fetch opponent's avatar
		fetch("/api/users/me/", {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			},
			credentials: 'include'
		})
		.then(response => {
			if (!response.ok) {
				throw new Error("Failed to fetch opponent's profile.");
			}
			return response.json();
		})
		.then(opponentData => {
			document.getElementById("opponent_icon_display").src = opponentData.avatar_url;
		})
		.catch(error => {
			console.error(error);
			new Toast(Toast.ERROR, "Failed to load opponent's avatar.");
		});
	})
	.catch(error => {
		new Toast(Toast.ERROR, error.message);
	});
}

function opponent_signout() {
	fetch("/api/logout_opponent/", {
		method: "POST",
		credentials: 'include'
	})
	.then(response => {
		if (!response.ok) {
			throw new Error("Failed to sign out opponent.");
		}
		new Toast(Toast.SUCCESS, "Opponent signed out!");

		if (window.location.pathname === "/start_pong_game" || window.location.pathname === "/start_tictactoe_game")
		{
			document.getElementById("opponent_signin_username").disabled = false;
			document.getElementById("opponent_signin_password").disabled = false;

			document.getElementById("sign_in_as_opponent_button").classList.remove('d-none');
			document.getElementById("opponent_info").classList.add('d-none');
			document.getElementById("opponent_icon_display").src = "/frontend/assets/default_profile_icon.webp";

			document.getElementById("opponent_signin_username").value = "";
			document.getElementById("opponent_signin_password").value = "";
		}
		// else //Not sure if we need this
		// 	load_home();
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