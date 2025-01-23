async function	signup()
{
	const username = document.getElementById("signup_username").value;
	const email = document.getElementById("signup_email").value;
	const password = document.getElementById("signup_password").value;
	const password_confirm = document.getElementById("signup_password_confirm").value;

	if (password != password_confirm)
		return (new Toast(Toast.ERROR, "Password does not match."));
	fetch("/api/register/",
	{
		method: "POST",
		headers:
		{
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(
		{
			"username": username,
			"email": email,
			"password": password,
			"avatar_url": "/frontend/assets/default_profile_icon.webp",
			"language_code": "en"
		})
	})
	.then(response =>
	{
		if (!response.ok)
		{
			console.log(response);
			new Toast(Toast.ERROR, "A network error occurred.");
			throw new Error("A network error occurred.");
		}
		return (response.json());
	})
	.then(data =>
	{
		new Toast(Toast.SUCCESS, "Account has been created!");
		load_home();
	})
	.catch(error =>
	{
		new Toast(Toast.ERROR, error);
	});
}

async function	signin()
{
	const username = document.getElementById("signin_username").value;
	const password = document.getElementById("signin_password").value;

	fetch("/api/token-auth/",
	{
		method: "POST",
		headers:
		{
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(
		{
			"username": username,
			"password": password,
		})
	})
	.then(response =>
	{
		if (!response.ok)
		{
			new Toast(Toast.ERROR, "Invalid credentials.");
			throw new Error("Invalid credentials.");
		}
		return (response.json());
	})
	.then(data =>
	{
		localStorage.setItem("auth-token", data.token);
		new Toast(Toast.SUCCESS, "Logged-in!");
		load_home();
	})
	.catch(error =>
	{
		console.error(error);
		new Toast(Toast.ERROR, error);
	});
}

async function opponent_signin(event) {
	event.preventDefault();
	const username = document.getElementById("opponent_signin_username").value;
	const password = document.getElementById("opponent_signin_password").value;

	console.log("Attempting to sign in as opponent...");
	fetch("/api/token-auth/", {
		method: "POST",
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			"username": username,
			"password": password,
		})
	})
	.then(response => {
		if (!response.ok)
			throw new Error("Opponent's credentials are invalid.");
		return response.json();
	})
	.then(data => {
		localStorage.setItem("opponent_auth-token", data.token);
		new Toast(Toast.SUCCESS, "Opponent logged-in!");
		console.log("Opponent logged-in!");

		// Disable the opponent sign-in inputs
		document.getElementById("opponent_signin_username").disabled = true;
		document.getElementById("opponent_signin_password").disabled = true;

		// Update UI to show opponent avatar and logout button
		document.getElementById("sign_in_as_opponent_button").classList.add('d-none');
		document.getElementById("opponent_info").classList.remove('d-none');

		// Fetch opponent's avatar
		console.log("Fetching opponent's avatar...");
		fetch("/api/users/me/", {
			method: "GET",
			headers: {
				"Authorization": `Token ${data.token}`,
				"Content-Type": "application/json"
			}
		})
		.then(response => {
			console.log("Response:", response);
			if (!response.ok) {
				throw new Error("Failed to fetch opponent's profile.");
			}
			return response.json();
		})
		.then(opponentData => {
			console.log("Opponent data:", opponentData);
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
	// Remove opponent token from localStorage
	localStorage.removeItem("opponent_auth-token");
	new Toast(Toast.SUCCESS, "Opponent signed out!");

	// Re-enable the opponent sign-in inputs
	document.getElementById("opponent_signin_username").disabled = false;
	document.getElementById("opponent_signin_password").disabled = false;

	document.getElementById("sign_in_as_opponent_button").classList.remove('d-none');
	document.getElementById("opponent_info").classList.add('d-none');
	document.getElementById("opponent_icon_display").src = "/frontend/assets/default_profile_icon.webp";

	// Optionally, you can also clear the input fields
	document.getElementById("opponent_signin_username").value = "";
	document.getElementById("opponent_signin_password").value = "";
}

function	signout()
{
	localStorage.removeItem("auth-token");
	localStorage.removeItem("opponent_auth-token");
	new Toast(Toast.SUCCESS, "Signed out successfully!");
}

async function	signin_42()
{
	let config = {};

	try {
		const response = await fetch('/api/config/');
		if (!response.ok) {
			throw new Error('Failed to fetch frontend configuration.');
		}
		config = await response.json();
	} catch (error) {
		console.error('Error fetching frontend configuration:', error);
	}

	if (!config.API_42_UID || !config.API_42_REDIRECT_URI) {
		console.error("OAuth configuration is missing.");
		new Toast(Toast.ERROR, "OAuth configuration is missing.");
		return;
	}
	const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${config.API_42_UID}&redirect_uri=${encodeURIComponent(config.API_42_REDIRECT_URI)}&response_type=code`;
	window.location.href = authUrl;
}

async function	signin_42_callback()
{
	const urlParams = new URLSearchParams(window.location.search);
	const token = urlParams.get('token');

	if (token) {
		localStorage.setItem("auth-token", token);
		history.pushState({ page: "home" }, "Home", "/home");
		new Toast(Toast.SUCCESS, "Logged in with 42!");
	}
}

async function signOut() {

	localStorage.removeItem("auth-token");
	new Toast(Toast.SUCCESS, "Signed out successfully!");
	load_home();
}

async function	isLogin()
{
	if (localStorage.getItem("auth-token") == null)
		return (false);
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
			return (false);
	}
	catch (error)
	{
		return (false);
	}
	return (true);
}