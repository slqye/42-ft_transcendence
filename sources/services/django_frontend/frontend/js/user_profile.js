async function	set_profile(template)
{
	try
	{
		const response = await fetch("/api/users/me/", {
			method: "GET",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
		});
		if (!response.ok)
		{
			new Toast(Toast.ERROR, "A network error occurred.");
			throw new Error("A network error occurred.");
		}
		const data = await response.json();
		template.edit.id.set.content("profile_display_name", "@" + data.display_name);
		template.edit.id.set.content("profile_user_name", "@" + data.username);
	}
	catch (error)
	{
		new Toast(Toast.ERROR, error);
	}
}

async function	set_profile_history(template)
{
	const all_matches = retrieve_matches();
	all_matches.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

	const history = template.edit.id.get.element("history");
	for (let index = 0; index < all_matches.length; index++)
	{
		const element = all_matches[index];
		let template = await new Template("frontend/html/pages/history_item.html").load();
		if (template == null)
			return console.error(ERROR_TEMPLATE);
		template.edit.id.set.attribute("match", "class", "list-group-item");
		if (element.result == "WIN")
			template.edit.id.add.attribute("match", "class", "bg-success");
		else
			template.edit.id.add.attribute("match", "class", "bg-danger");
		template.edit.id.set.content("match", element.type);
		console.log(template.edit.id.get.element("match"));
		history.appendChild(template.edit.id.get.element("match"));
		console.log(history.innerHTML);
	}
}

async function retrieve_matches()
{
	try
	{
		const response = await fetch("/api/users/me/matches/", {
			method: "GET",
			headers:
			{
				"Authorization": `Token ${localStorage.getItem("auth-token")}`,
				"Content-Type": "application/json"
			}
		});
		if (!response.ok)
			return (null);
		return (response.json());
	}
	catch (error)
	{
		return (null);
	}
}