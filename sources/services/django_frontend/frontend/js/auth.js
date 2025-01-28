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
		}),
		credentials: 'include'
	})
	.then(response =>
	{
		if (!response.ok)
		{
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

	fetch("/api/user/login/",
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
		}),
		credentials: 'include'
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
		new Toast(Toast.SUCCESS, "Logged-in!");
		load_home();
	})
	.catch(error =>
	{
		console.error(error);
		new Toast(Toast.ERROR, error);
	});
}

function	signout()
{
	fetch("/api/user/logout/", {
		method: "POST",
		credentials: 'include'
	})
	.then(response => {
		if (!response.ok) {
			throw new Error("Failed to sign out.");
		}
		new Toast(Toast.SUCCESS, "Signed out successfully!");
	})
	.catch(error => {
		console.error(error);
		new Toast(Toast.ERROR, "Failed to sign out.");
	});
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

function	signin_42_callback()
{
	const urlParams = new URLSearchParams(window.location.search);
	const token = urlParams.get('token');

	if (token) {
		history.pushState({ page: "home" }, "Home", "/home");
		new Toast(Toast.SUCCESS, "Logged in with 42!");
	}
}

async function	isLogin()
{
	console.log("isLogin");
	try {
		console.log("isLogin try");
		const data = await fetch_me();
		console.log("isLogin try data", data);
		if (!data)
			return false;
	} catch (error) {
		return false;
	}
	return true;
}