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
			"avatar_url": "https://example.com/avatar.png",
			"language_code": "en"
		})
	})
	.then(response =>
	{
		if (!response.ok)
		{
			new Toast(Toast.ERROR, "A network error occurred.");
			throw new Error("A network error occurred.");
		}
		response.json();
	})
	.then(data =>
	{
		new Toast(Toast.SUCCESS, "Account has been created!");
		load_home();
	})
	.catch(error =>
	{
		new Toast(Toast.ERROR, "An error occurred.");
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
		new Toast(Toast.ERROR, "An error occurred.");
	});
}

function	signout()
{
	localStorage.removeItem("auth-token");
}