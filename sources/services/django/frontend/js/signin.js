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