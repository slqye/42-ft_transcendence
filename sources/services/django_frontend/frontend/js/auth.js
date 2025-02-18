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
	const request = await new Api("/api/register/", Api.USER).set_method("POST").set_credentials("omit").set_body(request_body).request();
	if (request.status == Api.ERROR)
	{
		new Toast(Toast.ERROR, request.log);
		return ;
	}
	new Toast(Toast.SUCCESS, "Account has been created.");
	load_signin();
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
	const request = await new Api("/api/user/login/", Api.USER).set_method("POST").set_body(request_body).set_omit_refresh(true).request();
	if (request.status == Api.ERROR)
	{
		new Toast(Toast.ERROR, request.log);
		return ;
	}
	new Toast(Toast.SUCCESS, "Logged-in.");
	localStorage.setItem("user_authenticated", "true");
	load_home();
}

async function	signout()
{
	const request = await new Api("/api/user/logout/", Api.USER).set_method("POST").set_omit_refresh(true).request();
	if (request.status == Api.ERROR)
	{
		new Toast(Toast.ERROR, request.log);
		return ;
	}
	else
	{
		new Toast(Toast.SUCCESS, "Signed out.");
		localStorage.removeItem("user_authenticated");
		load_home();
	}
}

async function	signin_42(is_opponent = false, type = "skip")
{
	let config = {};

	const request = await new Api("/api/config/", Api.USER).set_credentials("omit").set_omit_refresh(true).request();
	if (request.status == Api.ERROR)
	{
		new Toast(Toast.ERROR, request.log);
		return ;
	}
	else
	{
		config = request.response;
		if (!config.API_42_UID || !config.API_42_REDIRECT_URI)
		{
			new Toast(Toast.ERROR, "OAuth configuration is missing.");
			return ;
		}
		else
		{
			let redirect_uri = config.API_42_REDIRECT_URI;
			if (is_opponent)
				redirect_uri += "?role=opponent";
			else
				redirect_uri += "?role=user";
			if (type == "match_pong")
				redirect_uri += "&type=match_pong";
			else if (type == "match_tictactoe")
				redirect_uri += "&type=match_tictactoe";
			else if (type == "tournament")
				redirect_uri += "&type=tournament";
			else
				redirect_uri += "&type=skip";
			const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${config.API_42_UID}&response_type=code&redirect_uri=${encodeURIComponent(redirect_uri)}`;
			window.location.href = authUrl;
		}
	}
}

async function	signin_42_callback(is_opponent = false, type = "skip", success_callback = false)
{
	if (!success_callback)
		return (new Toast(Toast.ERROR, "An error occurred while logging in with 42."));
	if (is_opponent)
		localStorage.setItem("opponent_authenticated", "true");
	else
		localStorage.setItem("user_authenticated", "true");
	if (!is_opponent && await Api.is_login())
	{
		new Toast(Toast.SUCCESS, "Logged in with 42!");
	}
	else if (is_opponent && await Api.is_opponent_login())
	{
		if (type !== "tournament")
			new Toast(Toast.SUCCESS, "Opponent logged in with 42!");
	}
	else
		new Toast(Toast.ERROR, "An error occurred while logging in with 42.");
	history.pushState({ page: "home" }, "Home", "/home");
}