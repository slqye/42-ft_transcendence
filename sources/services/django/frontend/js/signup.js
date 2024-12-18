async function	signup()
{
	const username = document.getElementById("signup_username").value;
	const email = document.getElementById("signup_email").value;
	const password = document.getElementById("signup_password").value;
	const password_confirm = document.getElementById("signup_password_confirm").value;

	if (password != password_confirm)
		return (show_toast("frontend/html/toasts/errors/password_match.html"));
	// TODO: faire la requette register
	show_toast("frontend/html/toasts/success/account_created.html")
}