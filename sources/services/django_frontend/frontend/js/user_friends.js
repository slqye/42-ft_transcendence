async function	set_friend_request_list(template)
{
	const data_holder = {
		"id": 5,
		"friendship_status": false,
		"friends": [
			{
				"id": 1,
				"username": "user1",
				"display_name": "User One",
				"avatar_url": "https://cdn-icons-png.flaticon.com/512/6915/6915987.png",
				"language_code": "en",
				"connected": "true",
				"created_at": "2025-02-04T12:34:56Z"
			},
			{
				"id": 2,
				"username": "user2",
				"display_name": "User Two",
				"avatar_url": "https://img.freepik.com/vecteurs-libre/cercle-bleu-utilisateur-blanc_78370-4707.jpg",
				"language_code": "en",
				"connected": "false",
				"created_at": "2025-02-04T12:35:56Z"
			}
		]
	}

	try
	{
		// const request = await new Api("/api/users/me/friendships/", Api.USER).request();
		// if (request.status == Api.ERROR)
		// 	return (console.error(request.log));
		const data = data_holder["friends"];
		const friends_container = template.edit.id.get.element("friends_container");
		for (let index = 0; index < data.length; index++) {
			const element = data[index];
			let friend_item = await new Template("frontend/html/pages/friend_item.html").load();
			if (friend_item == null)
				return (console.error(ERROR_TEMPLATE));
			friend_item.edit.id.set.attribute("friend_icon", "src", element["avatar_url"]);
			friend_item.edit.id.set.content("friend_display_name", element["display_name"]);
			friend_item.edit.id.set.content("friend_user_name", "@" + element["username"]);
			if (element["connected"] == "true")
			{
				friend_item.edit.id.add.attribute("friend_online_status", "class", "bg-success");
				friend_item.edit.id.set.attribute("friend_online_status", "data-bs-title", "online");
			}
			else
			{
				friend_item.edit.id.add.attribute("friend_online_status", "class", "bg-danger");
				friend_item.edit.id.set.attribute("friend_online_status", "data-bs-title", "offline");
			}
			friends_container.appendChild(friend_item.edit.id.get.element("friend"));
		}
	}
	catch (error)
	{
		return (console.error(error));
	}
}


async function	set_friend_list(template)
{
	const data_holder = {
		"id": 5,
		"friendship_status": false,
		"friends": [
			{
				"id": 1,
				"username": "user1",
				"display_name": "User One",
				"avatar_url": "https://cdn-icons-png.flaticon.com/512/6915/6915987.png",
				"language_code": "en",
				"connected": "true",
				"created_at": "2025-02-04T12:34:56Z"
			},
			{
				"id": 2,
				"username": "user2",
				"display_name": "User Two",
				"avatar_url": "https://img.freepik.com/vecteurs-libre/cercle-bleu-utilisateur-blanc_78370-4707.jpg",
				"language_code": "en",
				"connected": "false",
				"created_at": "2025-02-04T12:35:56Z"
			}
		]
	}

	try
	{
		// const request = await new Api("/api/users/me/friendships/", Api.USER).request();
		// if (request.status == Api.ERROR)
		// 	return (console.error(request.log));
		const data = data_holder["friends"];
		const friends_container = template.edit.id.get.element("friends_container");
		for (let index = 0; index < data.length; index++) {
			const element = data[index];
			let friend_item = await new Template("frontend/html/pages/friend_item.html").load();
			if (friend_item == null)
				return (console.error(ERROR_TEMPLATE));
			friend_item.edit.id.set.attribute("friend_icon", "src", element["avatar_url"]);
			friend_item.edit.id.set.content("friend_display_name", element["display_name"]);
			friend_item.edit.id.set.content("friend_user_name", "@" + element["username"]);
			if (element["connected"] == "true")
			{
				friend_item.edit.id.add.attribute("friend_online_status", "class", "bg-success");
				friend_item.edit.id.set.attribute("friend_online_status", "data-bs-title", "online");
			}
			else
			{
				friend_item.edit.id.add.attribute("friend_online_status", "class", "bg-danger");
				friend_item.edit.id.set.attribute("friend_online_status", "data-bs-title", "offline");
			}
			friends_container.appendChild(friend_item.edit.id.get.element("friend"));
		}
	}
	catch (error)
	{
		return (console.error(error));
	}
}
