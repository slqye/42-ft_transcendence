async function	edit_personal_info(key, value)
{
	const request_body = JSON.stringify({ [key]: value });
	const request = await new Api(`/api/users/update/${key}/`, Api.USER).set_method("POST").set_body(request_body).request();
	if (request.status == Api.ERROR)
		new Toast(Toast.ERROR, request.log);
	else
	{
		new Toast(Toast.SUCCESS, str_personal_info_updated());
		load_settings();
	}
}

async function edit_profile_picture(imageInput)
{
	const formData = new FormData()
	if (imageInput.files.length === 0) {
		new Toast(Toast.ERROR, str_no_file_selected());
		return;
	}
	formData.append('image', imageInput.files[0]);
	const request = await new Api(`/api/users/update/picture-upload/`, Api.USER).set_method("POST").set_body(formData).set_headers({}).set_language().request();
	if (request.status == Api.ERROR)
		new Toast(Toast.ERROR, request.log);
	else
	{
		new Toast(Toast.SUCCESS, str_profile_picture_updated());
		load_settings();
	}
}