async function	edit_personal_info(key, value)
{
	const request_body = JSON.stringify({ [key]: value });
	const request = await new Api(`/api/users/update/${key}/`, Api.USER).set_method("POST").set_body(request_body).request();
	if (request.status == Api.ERROR)
		new Toast(Toast.ERROR, request.log);
	else
	{
		new Toast(Toast.SUCCESS, `Your ${key} has been modified!`);
		load_settings();
	}
}