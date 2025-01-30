async function	signup()
{
	const display_name = document.getElementById("signup_display_name").value;
	const username = document.getElementById("signup_username").value;
	const email = document.getElementById("signup_email").value;
	const password = document.getElementById("signup_password").value;
	const password_confirm = document.getElementById("signup_password_confirm").value;

	if (password != password_confirm)
		return (new Toast(Toast.ERROR, "Password does not match."));
	const request_body = JSON.stringify(
	{
		"display_name": display_name,
		"username": username,
		"email": email,
		"password": password,
		"avatar_url": "/frontend/assets/default_profile_icon.webp",
		"language_code": "en"
	});
	const request = await new Api("/api/register/", Api.USER).set_method("POST").set_body(request_body).request();
	if (request.status == Api.ERROR)
	{
		new Toast(Toast.ERROR, request.log);
		throw new Error(request.log);
	}
	else
	{
		new Toast(Toast.SUCCESS, "Account has been created.");
		load_signin();
	}
}

async function	signin()
{
	const username = document.getElementById("signin_username").value;
	const password = document.getElementById("signin_password").value;

	const request_body = JSON.stringify(
	{
		"username": username,
		"password": password
	});
	const request = await new Api("/api/user/login/", Api.USER).set_method("POST").set_body(request_body).request();
	if (request.status == Api.ERROR)
	{
		new Toast(Toast.ERROR, request.log);
		throw new Error(request.log);
	}
	else
	{
		new Toast(Toast.SUCCESS, "Logged-in.");
		load_home();
	}
}

async function	signout()
{
	const request = await new Api("/api/user/logout/", Api.USER).set_method("POST").set_credentials("include").request();
	if (request.status == Api.ERROR)
	{
		new Toast(Toast.ERROR, request.log);
		throw new Error(request.log);
	}
	else
	{
		new Toast(Toast.SUCCESS, "Signed out.");
		load_home();
	}
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