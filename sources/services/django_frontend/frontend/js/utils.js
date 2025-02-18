function	switch_theme()
{
	const body = document.querySelector("body");

	if (body.getAttribute("data-bs-theme") == "dark")
		switch_theme_light(body);
	else
		switch_theme_dark(body);
}

function	switch_theme_light(body)
{
	const icon_sun = document.getElementById("theme_icon_sun");
	const icon_moon = document.getElementById("theme_icon_moon");
	const signin_42_user_btn = document.getElementById("signin_42_user_btn");
	const signin_42_opponent_btn = document.getElementById("signin_42_opponent_btn");
	const logo_42_user = document.getElementById("logo_42_user");
	const logo_42_opponent = document.getElementById("logo_42_opponent");

	body.setAttribute("data-bs-theme", "light");
	body.classList.remove("bg-dark");
	body.classList.add("bg-light");
	icon_sun.classList.remove("d-lg-inline-block");
	icon_sun.classList.add("d-lg-none");
	icon_moon.classList.remove("d-lg-none");
	icon_moon.classList.add("d-lg-inline-block");

	if (logo_42_user) {
		logo_42_user.src = "/frontend/assets/42logo_light.svg";
	}

	if (logo_42_opponent) {
		logo_42_opponent.src = "/frontend/assets/42logo_light.svg";
	}

	if (signin_42_user_btn) {
		signin_42_user_btn.classList.remove("btn-outline-light");
		signin_42_user_btn.classList.add("btn-outline-dark");
	}

	if (signin_42_opponent_btn) {
		signin_42_opponent_btn.classList.remove("btn-outline-light");
		signin_42_opponent_btn.classList.add("btn-outline-dark");
	}
}

function	switch_theme_dark(body)
{
	const icon_sun = document.getElementById("theme_icon_sun");
	const icon_moon = document.getElementById("theme_icon_moon");
	const logo_42_user = document.getElementById("logo_42_user");
	const logo_42_opponent = document.getElementById("logo_42_opponent");
	const signin_42_user_btn = document.getElementById("signin_42_user_btn");
	const signin_42_opponent_btn = document.getElementById("signin_42_opponent_btn");
	body.setAttribute("data-bs-theme", "dark");
	body.classList.remove("bg-light");
	body.classList.add("bg-dark");
	icon_moon.classList.remove("d-lg-inline-block");
	icon_moon.classList.add("d-lg-none");
	icon_sun.classList.remove("d-lg-none");
	icon_sun.classList.add("d-lg-inline-block");

	if (logo_42_user) {
		logo_42_user.src = "/frontend/assets/42logo_dark.svg";
	}

	if (logo_42_opponent) {
		logo_42_opponent.src = "/frontend/assets/42logo_dark.svg";
	}

	if (signin_42_user_btn) {
		signin_42_user_btn.classList.remove("btn-outline-dark");
		signin_42_user_btn.classList.add("btn-outline-light");
	}

	if (signin_42_opponent_btn) {
		signin_42_opponent_btn.classList.remove("btn-outline-dark");
		signin_42_opponent_btn.classList.add("btn-outline-light");
	}
}

function	set_theme_signin42()
{
	const theme = document.body.getAttribute("data-bs-theme");
	const logo_42_user = document.getElementById("logo_42_user");
	const signin_42_user_btn = document.getElementById("signin_42_user_btn");
	const logo_42_opponent = document.getElementById("logo_42_opponent");
	const signin_42_opponent_btn = document.getElementById("signin_42_opponent_btn");


	if (theme === "dark")
	{
		if (logo_42_user)
			logo_42_user.src = "/frontend/assets/42logo_dark.svg";
		if (signin_42_user_btn)
		{
			signin_42_user_btn.classList.remove("btn-outline-dark");
			signin_42_user_btn.classList.add("btn-outline-light");
		}
		if (logo_42_opponent)
			logo_42_opponent.src = "/frontend/assets/42logo_dark.svg";
		if (signin_42_opponent_btn)
		{
			signin_42_opponent_btn.classList.remove("btn-outline-dark");
			signin_42_opponent_btn.classList.add("btn-outline-light");
		}
	}
	else
	{
		if (logo_42_user)
			logo_42_user.src = "/frontend/assets/42logo_light.svg";
		if (signin_42_user_btn)
		{
			signin_42_user_btn.classList.remove("btn-outline-light");
			signin_42_user_btn.classList.add("btn-outline-dark");
		}
		if (logo_42_opponent)
			logo_42_opponent.src = "/frontend/assets/42logo_light.svg";
		if (signin_42_opponent_btn)
		{
			signin_42_opponent_btn.classList.remove("btn-outline-light");
			signin_42_opponent_btn.classList.add("btn-outline-dark");
		}
	}
}

function	isMobile()
{
	const userAgent = navigator.userAgent.toLowerCase();
	return (/iphone|ipod|android|webos|blackberry|iemobile|opera mini/.test(userAgent));
}

async function	fetch_me()
{
	const request = await new Api("/api/users/me/", Api.USER).request();
	if (request.status == Api.ERROR)
		return null;
	return request.response;
}

async function	fetch_opponent()
{
	const request = await new Api("/api/users/me/", Api.OPPONENT).request();
	if (request.status == Api.ERROR)
		return null;
	return request.response;
}

async function	fetch_user(user_id)
{
	const request = await new Api("/api/users/" + user_id + "/", Api.USER).request();
	if (request.status == Api.ERROR)
		return null;
	return request.response;
}