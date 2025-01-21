async function	set_profile(template)
{
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
		{
			new Toast(Toast.ERROR, "A network error occurred.");
			throw new Error("A network error occurred.");
		}
		const data = await response.json();
		template.edit.id.set.content("profile_user_name", "@" + data.username);
	}
	catch (error)
	{
		new Toast(Toast.ERROR, error);
	}
}

async function	set_profile_history(template)
{
	// const pong_matches = await retrieve_pong_matches();
	// const tictactoe_matches = await retrieve_tictactoe_matches();

	const pong_matches = [
		{
			"type": "PONG",
			"id": 101,
			"player_user": "pasellio",
			"opponent_user": "john_doe",
			"result": "WIN",
			"created_at": "2024-01-15T14:00:00Z"
		}
	];
	const tictactoe_matches = [
		{
			"type": "TICTACTOE",
			"id": 101,
			"player_user": "pasellio",
			"opponent_user": "john_doe",
			"result": "WIN",
			"created_at": "2024-01-15T13:00:00Z"
		},
		{
			"type": "TICTACTOE",
			"id": 102,
			"player_user": "pasellio",
			"opponent_user": "john_doe",
			"result": "LOSS",
			"created_at": "2024-01-15T15:00:00Z"
		}
	];


	if (pong_matches == null || tictactoe_matches == null)
	{
		new Toast(Toast.ERROR, "A network error occurred.");
		throw new Error("A network error occurred.");
	}

	const all_matches = [...pong_matches, ...tictactoe_matches];
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

async function retrieve_pong_matches()
{
	try
	{
		const response = await fetch("/api/users/me/matches/pong/", {
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

async function retrieve_tictactoe_matches()
{
	try
	{
		const response = await fetch("/api/users/me/matches/tictactoe/", {
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