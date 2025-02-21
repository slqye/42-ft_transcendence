async function	set_friend_list(template)
{
	try
	{
		const request = await new Api("/api/users/me/friendships/", Api.USER).request();
		if (request.status == Api.ERROR)
			return (new Toast(Toast.ERROR, request.log));
		const data = request.response["friends"];
		const friends_requests_container = template.edit.id.get.element("requests_container");
		const friends_container = template.edit.id.get.element("friends_container");
		for (let key in data) {
			const element = data[key];
			if (element["friendship_status"] == false)
			{
				let friend_request_template = await new Template("frontend/html/pages/friend_request_item.html").load();
				if (friend_request_template == null)
					return (new Toast(Toast.ERROR, str_template_error()));
				set_friend_request_data(element, key, friend_request_template, friends_requests_container);
			}
			else
			{
				let friend_template = await new Template("frontend/html/pages/friend_item.html").load();
				if (friend_template == null)
					return (new Toast(Toast.ERROR, str_template_error()));
				set_friend_data(element, friend_template, friends_container);
			}
		}
		if (friends_requests_container.children.length >= 1 && friends_container.children.length)
			template.edit.id.set.attribute("horizontal_friends_rule", "class", "")
	}
	catch (error)
	{
		return (new Toast(Toast.ERROR, error));
	}
}

async function	set_friend_request_data(data, friendship_key, template, container)
{
	template.edit.id.set.attribute("profile_icon", "src", data["avatar_url"]);
	template.edit.id.set.attribute("accept_request_btn", "data-request-id", friendship_key);
	template.edit.id.set.attribute("refuse_request_btn", "data-request-id", friendship_key);
	template.edit.id.set.content("user_name", "@" + data["username"]);
	container.appendChild(template.edit.id.get.element("friend_request"));
}

async function	set_friend_data(data, template, container)
{
	template.edit.id.set.attribute("friend_icon", "src", data["avatar_url"]);
	template.edit.id.set.attribute("btn_view_profile", "data-request-id", data["id"]);
	template.edit.id.set.content("friend_display_name", data["display_name"]);
	template.edit.id.set.content("friend_user_name", "@" + data["username"]);
	if (data["is_connected"] == true)
	{
		template.edit.id.add.attribute("friend_online_status", "class", "bg-success");
		template.edit.id.set.attribute("friend_online_status", "data-bs-title", str_online());
	}
	else
	{
		template.edit.id.add.attribute("friend_online_status", "class", "bg-danger");
		template.edit.id.set.attribute("friend_online_status", "data-bs-title", str_offline());
	}
	container.appendChild(template.edit.id.get.element("friend"));
}

async function	add_friend(username)
{
	const request = await new Api(`/api/friendships/${username}/`, Api.USER).set_method("POST").request();
	document.getElementById('username_request_input').value = "";
	if (request.status == Api.ERROR)
		return (new Toast(Toast.ERROR, request.log));
	return (new Toast(Toast.SUCCESS, str_friend_request_sent()));
}

async function	accept_friend_request(current_html)
{
	const friendship_id = current_html.getAttribute("data-request-id");
	const request = await new Api(`/api/friendships/${friendship_id}/`, Api.USER).set_method("PUT").request();
	if (request.status == Api.ERROR)
		return (new Toast(Toast.ERROR, request.log));
	return (new Toast(Toast.SUCCESS, str_friend_request_accepted()), load_friends());
}

async function	refuse_friend_request(current_html)
{
	const friendship_id = current_html.getAttribute("data-request-id");
	const request = await new Api(`/api/friendships/${friendship_id}/`, Api.USER).set_method("DELETE").request();
	if (request.status == Api.ERROR)
		return (new Toast(Toast.ERROR, request.log));
	return (new Toast(Toast.SUCCESS, str_friend_request_refused()), load_friends());
}