async function	set_profile(template)
{
	try
	{
		const request = await new Api("/api/users/me/", Api.USER).request();
		if (request.status == Api.ERROR)
			return (console.error(request.log));
		const data = request.response;
		template.edit.id.set.content("profile_display_name", data.display_name);
		template.edit.id.set.content("profile_user_name", "@" + data.username);
	}
	catch (error)
	{
		return (console.error(error));
	}
}

async function	set_profile_history(template)
{
	try
	{
		const request = await new Api("/api/users/me/matches/", Api.USER).request();
		if (request.status == Api.ERROR)
			return (console.error(request.log));
		const data = await request.response;
		const history = template.edit.id.get.element("history");
		for (let index = 0; index < data.length; index++)
		{
			const element = data[index];
			let template = await new Template("frontend/html/pages/history_item.html").load();
			if (template == null)
				return console.error(ERROR_TEMPLATE);
			if (element.result == "WIN")
				template.edit.id.add.attribute("match", "class", "bg-success");
			else
				template.edit.id.add.attribute("match", "class", "bg-danger");
			history.appendChild(template.edit.id.get.element("match"));
		}
	}
	catch (error)
	{
		return (console.error(error));
	}
}