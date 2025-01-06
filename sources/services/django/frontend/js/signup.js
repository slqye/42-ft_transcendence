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
	.then(response => response.json())
	.then(data =>
	{
		load_home();
		new Toast(Toast.SUCCESS, "Account has been created!");
	})
	.catch(error =>
	{
		new Toast(Toast.ERROR, "An error occurred.");
	});
}