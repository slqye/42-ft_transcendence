async function	edit_personal_info(key, value)
{
	fetch(`/api/users/update/${key}/`,
	{
		method: "POST",
		headers:
		{
			"Authorization": `Token ${localStorage.getItem("auth-token")}`,
			"Content-Type": 'application/json',
		},
		body: JSON.stringify(
		{
			key: value
		})
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
		new Toast(Toast.SUCCESS, `Your ${key} has been modified!`);
		load_settings();
	})
	.catch(error =>
	{
		new Toast(Toast.ERROR, error);
	});
}